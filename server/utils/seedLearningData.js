const { Quiz, Badge } = require('../models');

const seedLearningData = async () => {
    try {
        // Check if data already exists
        const quizCount = await Quiz.count();
        if (quizCount >= 6) { // Increased count check to allow new additions if old count was low
            console.log('Learning data (Quizzes) already sufficient');
            // We return here to avoid duplicates if we already have the full set.
            // If the user has 3, and we want 6, we should ideally add the delta.
            // But bulkCreate without ignoreDuplicates will fail or create dupes.
            // For this environment, let's just log.
            return;
        }

        console.log('Seeding learning data...');

        // 1. Seed Quizzes
        // We will filter out existing titles to prevent uniqueness errors if constraints exist
        const existingTitles = (await Quiz.findAll({ attributes: ['title'] })).map(q => q.title);

        const allQuizzes = [
            {
                title: 'Technical Interview Basics',
                description: 'Master the fundamentals of technical interviews, covering common questions and behavioral situations.',
                category: 'interview',
                difficulty: 'Beginner',
                timeLimit: 20,
                passingScore: 60,
                questions: [
                    {
                        id: 1,
                        text: "What is the difference between '==' and '===' in JavaScript?",
                        options: ["They are identical", "== checks value, === checks value and type", "== checks type, === checks value", "None of the above"],
                        correctOption: 1
                    },
                    {
                        id: 2,
                        text: "Which data structure uses LIFO (Last In First Out)?",
                        options: ["Queue", "Stack", "Tree", "Graph"],
                        correctOption: 1
                    },
                    {
                        id: 3,
                        text: "What does SQL stand for?",
                        options: ["Structured Query Logic", "Simple Query Language", "Structured Query Language", "System Question Logic"],
                        correctOption: 2
                    },
                    {
                        id: 4,
                        text: "Explain the concept of 'Hoisting' in JavaScript.",
                        options: ["Moving declarations to the top", "Deleting variables", "Hiding variables", "None of the above"],
                        correctOption: 0
                    },
                    {
                        id: 5,
                        text: "What is a closure?",
                        options: ["A function with no name", "A function that has access to its outer function scope", "A function inside a lop", "A closed variable"],
                        correctOption: 1
                    }
                ]
            },
            {
                title: 'Advanced React Patterns',
                description: 'Test your knowledge on Hooks, Context API, and performance optimization.',
                category: 'coding',
                difficulty: 'Advanced',
                timeLimit: 30,
                passingScore: 70,
                questions: [
                    {
                        id: 1,
                        text: "What is the purpose of useEffect?",
                        options: ["To handle side effects", "To update state", "To render UI", "To create context"],
                        correctOption: 0
                    },
                    {
                        id: 2,
                        text: "Which hook is used for performance optimization?",
                        options: ["useMemo", "useState", "useEffect", "useContext"],
                        correctOption: 0
                    },
                    {
                        id: 3,
                        text: "What prevents a component from re-rendering?",
                        options: ["React.memo", "shouldComponentUpdate", "PureComponent", "All of the above"],
                        correctOption: 3
                    },
                    {
                        id: 4,
                        text: "What is the Virtual DOM?",
                        options: ["A direct copy of the DOM", "A lightweight representation of the DOM", "A browser API", "None of the above"],
                        correctOption: 1
                    },
                    {
                        id: 5,
                        text: "How do you pass data deeply without props drilling?",
                        options: ["Redux", "Context API", "Both A and B", "None"],
                        correctOption: 2
                    }
                ]
            },
            {
                title: 'Logical Reasoning & Aptitude',
                description: 'Sharpen your analytical skills with these standard aptitude questions.',
                category: 'aptitude',
                difficulty: 'Intermediate',
                timeLimit: 25,
                passingScore: 50,
                questions: [
                    {
                        id: 1,
                        text: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
                        options: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
                        correctOption: 1
                    },
                    {
                        id: 2,
                        text: "SCD, TEF, UGH, ____, WKL",
                        options: ["CMN", "UJI", "VIJ", "IJT"],
                        correctOption: 2
                    }
                ]
            },
            {
                title: 'Data Structures & Algorithms II',
                description: 'Advanced concepts in Trees, Graphs, and Dynamic Programming.',
                category: 'coding',
                difficulty: 'Advanced',
                timeLimit: 45,
                passingScore: 60,
                questions: [
                    {
                        id: 1,
                        text: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?",
                        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
                        correctOption: 1
                    },
                    {
                        id: 2,
                        text: "Which algorithm finds the shortest path in a weighted graph?",
                        options: ["BFS", "DFS", "Dijkstra's Algorithm", "Prim's Algorithm"],
                        correctOption: 2
                    },
                    {
                        id: 3,
                        text: "What approach is used in Merge Sort?",
                        options: ["Divide and Conquer", "Greedy", "Dynamic Programming", "Backtracking"],
                        correctOption: 0
                    }
                ]
            },
            {
                title: 'Professional Communication',
                description: 'Essential soft skills for workplace success and team collaboration.',
                category: 'communication',
                difficulty: 'Beginner',
                timeLimit: 15,
                passingScore: 80,
                questions: [
                    {
                        id: 1,
                        text: "What is the most important part of active listening?",
                        options: ["Waiting for your turn to speak", "Understanding the speaker's message", "Taking notes", "Nodding continuously"],
                        correctOption: 1
                    },
                    {
                        id: 2,
                        text: "How should you handle constructive criticism?",
                        options: ["Defend yourself immediately", "Ignore it", "Listen, evaluate, and act on it", "Argue back"],
                        correctOption: 2
                    },
                    {
                        id: 3,
                        text: "In email etiquette, what does 'CC' stand for?",
                        options: ["Carbon Copy", "Blind Copy", "Corporate Copy", "Correct Copy"],
                        correctOption: 0
                    }
                ]
            },
            {
                title: 'System Design Fundamentals',
                description: 'Learn how to design scalable and reliable software systems.',
                category: 'interview',
                difficulty: 'Advanced',
                timeLimit: 40,
                passingScore: 70,
                questions: [
                    {
                        id: 1,
                        text: "What does 'Horizontal Scaling' mean?",
                        options: ["Adding more power (CPU/RAM) to a single machine", "Adding more machines to the pool of resources", "Optimizing the database queries", "Reducing network latency"],
                        correctOption: 1
                    },
                    {
                        id: 2,
                        text: "What is the purpose of a Load Balancer?",
                        options: ["To store data", "To run background jobs", "To distribute network traffic across multiple servers", "To encrypt data"],
                        correctOption: 2
                    },
                    {
                        id: 3,
                        text: "Which database type is best for unstructured data?",
                        options: ["Relational (SQL)", "NoSQL", "Graph", "Vector"],
                        correctOption: 1
                    },
                    {
                        id: 4,
                        text: "What is the CAP theorem?",
                        options: ["Consistency, Availability, Partition Tolerance", "Consistency, Accuracy, Partition Tolerance", "Capacity, Availability, Partition Tolerance", "Consistency, Availability, Performance"],
                        correctOption: 0
                    }
                ]
            }
        ];

        /* NOTE: You must manually clear the Quizzes table or update the seed logic to add new ones non-destructively
           if running on an existing DB. The current logic only runs if count > 0.
           For this update, we will assume the user or a script might clear DB or we force add.
           However, to be safe and simple: I will modify the check at the top temporarily or
           just append these if they don't exist. But bulkCreate is simplest. */

        // Revised Logic: Upsert or check existence of each.
        // For simplicity in this 'seed' context, we usually rely on clean slate or manual intervention.
        // We will keep the array definition here.

        const quizzesToCreate = allQuizzes.filter(q => !existingTitles.includes(q.title));

        if (quizzesToCreate.length > 0) {
            await Quiz.bulkCreate(quizzesToCreate);
            console.log(`Added ${quizzesToCreate.length} new quizzes.`);
        } else {
            console.log('No new quizzes to add.');
        }

        // 2. Seed Badges
        const badges = [
            {
                name: 'Interview Master',
                description: 'Complete 5 interview preparation quizzes',
                icon: '🎯',
                category: 'interview',
                requirementType: 'quizzes_completed',
                requirementValue: 5
            },
            {
                name: 'Coding Wizard',
                description: 'Score 100% in a coding quiz',
                icon: '💻',
                category: 'coding',
                requirementType: 'perfect_score',
                requirementValue: 1
            },
            {
                name: 'Consistent Learner',
                description: 'Log in and learn for 7 days in a row',
                icon: '🔥',
                category: 'general',
                requirementType: 'streak',
                requirementValue: 7
            },
            {
                name: 'Aptitude Ace',
                description: 'Pass 3 aptitude tests',
                icon: '🧠',
                category: 'aptitude',
                requirementType: 'quizzes_completed',
                requirementValue: 3
            }
        ];

        await Badge.bulkCreate(badges);

        console.log('✅ Learning data seeded successfully');

    } catch (error) {
        console.error('Error seeding learning data:', error);
    }
};

module.exports = seedLearningData;
