const express = require('express');
const router = express.Router();
const { Student, Quiz, QuizAttempt, Badge, StudentBadge, sequelize } = require('../models');
const { Op } = require('sequelize');

// Middleware to verify student token (simplified version of the one in index.js)
const verifyStudentObj = (req, res, next) => {
    // This expects the user to be attached by the main auth middleware in index.js
    // OR we assume the logic is handling it. 
    // Ideally, we move the verifyToken middleware to a separate file, but for now
    // we will rely on `req.user` being set by the calling function or implement basic check here if needed.
    // Given the architecture in index.js, it seems routes are mounted directly.
    // We'll create a standalone verification here since extracting it might break index.js structure now.

    // Actually, looking at index.js, there isn't a global middleware setting req.user.
    // Each route does verification manually. We will do the same here using a helper.
    const jwt = require('jsonwebtoken');
    const token = req.headers.authorization?.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        if (decoded.role !== 'student') {
            throw new Error('Unauthorized');
        }
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

router.use(verifyStudentObj);

// GET /api/learning/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const studentId = req.user.id;

        // 1. Get Quizzes Stats
        const attempts = await QuizAttempt.findAll({ where: { studentId } });
        const passedAttempts = attempts.filter(a => a.score >= 60); // Assuming 60 is general pass, or check per quiz

        // Calculate average score
        const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
        const averageScore = attempts.length > 0 ? (totalScore / attempts.length).toFixed(1) : 0;

        // 2. Get Badges Stats
        const earnedBadges = await StudentBadge.count({ where: { studentId } });
        const totalBadges = await Badge.count();

        // 3. Get Recent Activity (Last 5 attempts with quiz details)
        const recentActivityRaw = await QuizAttempt.findAll({
            where: { studentId },
            include: [{ model: Quiz, attributes: ['title', 'category', 'difficulty'] }],
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        const recentActivity = recentActivityRaw.map(a => ({
            id: a.id,
            quizTitle: a.Quiz.title,
            category: a.Quiz.category,
            score: a.score,
            date: a.createdAt,
            passed: a.score >= 60 // Simple pass check
        }));

        res.json({
            stats: {
                quizzesCompleted: passedAttempts.length, // Or total attempts depending on definition
                totalAttempts: attempts.length,
                badgesEarned: earnedBadges,
                totalBadges,
                averageScore
            },
            recentActivity
        });

    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/learning/quizzes
router.get('/quizzes', async (req, res) => {
    try {
        const studentId = req.user.id;
        const quizzes = await Quiz.findAll({ where: { isActive: true } });
        const attempts = await QuizAttempt.findAll({ where: { studentId } });

        // Map quizzes to include user status
        const quizzesWithStatus = quizzes.map(q => {
            const quizAttempts = attempts.filter(a => a.quizId === q.id);
            const bestScore = quizAttempts.length > 0 ? Math.max(...quizAttempts.map(a => a.score)) : null;
            const completed = bestScore !== null && bestScore >= q.passingScore;

            return {
                id: q.id,
                title: q.title,
                description: q.description,
                category: q.category,
                difficulty: q.difficulty,
                questionsCount: q.questions ? q.questions.length : 0,
                timeLimit: q.timeLimit,
                completed,
                bestScore,
                attempts: quizAttempts.length
            };
        });

        res.json(quizzesWithStatus);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/learning/quiz/:id
router.get('/quiz/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        // Remove correct answers from questions before sending to client
        const questionsForClient = quiz.questions.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options
        }));

        res.json({
            ...quiz.toJSON(),
            questions: questionsForClient
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/learning/quiz/:id/submit
router.post('/quiz/:id/submit', async (req, res) => {
    try {
        console.log('Submit Quiz Request:', {
            studentId: req.user?.id,
            quizId: req.params.id,
            body: req.body
        });

        const studentId = req.user.id;
        const quizId = req.params.id;
        const { answers } = req.body; // { questionId: selectedOptionIndex }

        const quiz = await Quiz.findByPk(quizId);
        if (!quiz) {
            console.log('Quiz not found:', quizId);
            return res.status(404).json({ message: 'Quiz not found' });
        }

        console.log('Quiz found:', quiz.title);
        console.log('Questions:', quiz.questions);
        console.log('User Answers:', answers);

        // Calculate score
        let correctCount = 0;
        let questions = quiz.questions;

        // Handle potential string format (SQLite/Sequelize quirk)
        if (typeof questions === 'string') {
            try {
                questions = JSON.parse(questions);
            } catch (e) {
                console.error('Error parsing quiz questions:', e);
                questions = [];
            }
        }

        if (!Array.isArray(questions)) {
            console.error('Questions is not an array:', questions);
            return res.status(500).json({ message: 'Quiz data error' });
        }

        questions.forEach(q => {
            // Ensure q.id and answers keys are comparable (fastest way is loose equality or string conversion)
            // answers keys are usually strings from JSON payload
            // q.id is likely number
            if (answers && answers[q.id] == q.correctOption) {
                correctCount++;
            }
        });

        const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
        const passed = score >= quiz.passingScore;

        // Record attempt
        const attempt = await QuizAttempt.create({
            studentId,
            quizId,
            score,
            answers,
            passed,
            timeSpent: req.body.timeSpent || 0 // Default to 0 if not provided
        });

        // Check for Badge Unlocks (Simple logic for now)
        // 1. Check for "Coding Wizard" (Perfect Score)
        if (score === 100 && quiz.category === 'coding') {
            const badge = await Badge.findOne({ where: { name: 'Coding Wizard' } });
            if (badge) {
                await StudentBadge.findOrCreate({
                    where: { studentId, badgeId: badge.id }
                });
            }
        }

        // 2. Check for "Interview Master" (5 interview quizzes)
        if (quiz.category === 'interview') {
            const count = await QuizAttempt.count({
                include: [{ model: Quiz, where: { category: 'interview' } }],
                where: { studentId }
            });
            if (count >= 5) {
                const badge = await Badge.findOne({ where: { name: 'Interview Master' } });
                if (badge) await StudentBadge.findOrCreate({ where: { studentId, badgeId: badge.id } });
            }
        }

        res.json({
            success: true,
            score,
            passed,
            correctCount,
            totalQuestions: quiz.questions.length,
            attemptId: attempt.id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/learning/badges
router.get('/badges', async (req, res) => {
    try {
        const studentId = req.user.id;
        const allBadges = await Badge.findAll();
        const earnedBadges = await StudentBadge.findAll({ where: { studentId } });
        const earnedBadgeIds = new Set(earnedBadges.map(b => b.badgeId));

        const badgesWithStatus = allBadges.map(b => ({
            ...b.toJSON(),
            earned: earnedBadgeIds.has(b.id),
            progress: 0, // dynamic progress calculation requires more complex logic, keeping simple for now
            total: b.requirementValue
        }));

        res.json(badgesWithStatus);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
