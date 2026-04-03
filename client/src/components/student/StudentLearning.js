import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Play, CheckCircle, Star, Trophy, Target, Brain, Code, Users, Timer, X, ArrowRight, Loader } from 'lucide-react';
import api from '../../services/authService';

const StudentLearning = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [badges, setBadges] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState({
    completedQuizzes: 0,
    totalQuizzes: 0,
    earnedBadges: 0,
    totalBadges: 0,
    averageScore: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null); // The quiz currently being taken
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    if (!activeQuiz) {
      fetchLearningData();
    }
  }, [activeTab, activeQuiz]);

  const fetchLearningData = async () => {
    setLoading(true);
    try {
      // Fetch Dashboard Data
      const dashRes = await api.get('/learning/dashboard');
      const dashData = dashRes.data;
      setProgress(dashData.stats);
      setRecentActivity(dashData.recentActivity);

      // Fetch Quizzes if needed (or we can fetch when tab changes, but simpler to fetch all now for simplicity)
      const quizzesRes = await api.get('/learning/quizzes');
      setQuizzes(quizzesRes.data);

      const badgesRes = await api.get('/learning/badges');
      setBadges(badgesRes.data);

    } catch (error) {
      console.error('Error fetching learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (quizId) => {
    setQuizLoading(true);
    try {
      const res = await api.get(`/learning/quiz/${quizId}`);
      setQuizQuestions(res.data.questions);
      setActiveQuiz(res.data);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizResult(null);
    } catch (error) {
      console.error("Failed to start quiz", error);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    const questionId = quizQuestions[currentQuestionIndex].id;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const submitQuiz = async () => {
    setQuizLoading(true);
    try {
      const payload = {
        answers: selectedAnswers
      };
      const res = await api.post(`/learning/quiz/${activeQuiz.id}/submit`, payload);
      setQuizResult(res.data);
    } catch (error) {
      console.error("Failed to submit quiz", error);
      alert("Failed to submit quiz. Please check your connection and try again.");
    } finally {
      setQuizLoading(false);
    }
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    fetchLearningData(); // Refresh data
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-900/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-900/30';
      case 'Advanced': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'interview': return <Target className="h-5 w-5" />;
      case 'coding': return <Code className="h-5 w-5" />;
      case 'aptitude': return <Brain className="h-5 w-5" />;
      case 'communication': return <Users className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  /* --- RENDER HELPERS --- */

  // QUIZ INTERFACE
  if (activeQuiz) {
    // QUIZ INTERFACE
    if (quizResult) {
      return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 max-w-lg w-full text-center animate-in zoom-in-50">
            {quizResult.passed ? (
              <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-10 h-10 text-green-500" />
              </div>
            ) : (
              <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <X className="w-10 h-10 text-red-500" />
              </div>
            )}

            <h2 className="text-3xl font-bold text-white mb-2">{quizResult.score}%</h2>
            <h3 className="text-xl font-semibold text-gray-300 mb-6">
              {quizResult.passed ? 'Quiz Passed!' : 'Keep Trying!'}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-neutral-800 p-4 rounded-xl">
                <div className="text-sm text-gray-400">Correct</div>
                <div className="text-xl font-bold text-green-400">{quizResult.correctCount}</div>
              </div>
              <div className="bg-neutral-800 p-4 rounded-xl">
                <div className="text-sm text-gray-400">Total</div>
                <div className="text-xl font-bold text-white">{quizResult.totalQuestions}</div>
              </div>
            </div>

            <button onClick={closeQuiz} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors">
              Back to Dashboard
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col">
        {/* Quiz Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={closeQuiz}><X className="text-gray-400 hover:text-white" /></button>
            <div>
              <h2 className="text-lg font-bold text-white">{activeQuiz.title}</h2>
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded textxs ${getDifficultyColor(activeQuiz.difficulty)}`}>{activeQuiz.difficulty}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white bg-neutral-800 px-3 py-1.5 rounded-lg">
            <Timer size={16} />
            <span className="font-mono">{activeQuiz.timeLimit}:00</span>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6">
          {/* Progress Bar */}
          <div className="w-full bg-neutral-800 h-2 rounded-full mb-8">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex-1">
            <div className="mb-2 text-purple-400 font-medium tracking-wide">Question {currentQuestionIndex + 1} of {quizQuestions.length}</div>
            <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">
              {quizQuestions[currentQuestionIndex]?.text}
            </h3>

            <div className="space-y-4">
              {quizQuestions[currentQuestionIndex]?.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4
                                        ${selectedAnswers[quizQuestions[currentQuestionIndex].id] === idx
                      ? 'border-purple-500 bg-purple-500/10 text-white'
                      : 'border-neutral-800 bg-neutral-900 text-gray-300 hover:border-neutral-600 hover:bg-neutral-800'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                         ${selectedAnswers[quizQuestions[currentQuestionIndex].id] === idx ? 'border-purple-500' : 'border-neutral-600'}`}>
                    {selectedAnswers[quizQuestions[currentQuestionIndex].id] === idx && <div className="w-3 h-3 bg-purple-500 rounded-full" />}
                  </div>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-neutral-800">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
            >
              Previous
            </button>

            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-6 py-2.5 bg-white text-black rounded-lg font-bold hover:bg-neutral-200 flex items-center gap-2"
              >
                Next <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={submitQuiz}
                className="px-8 py-2.5 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2"
              >
                {quizLoading ? <Loader className="animate-spin" /> : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 shadow-2xl rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-purple-400" />
              Learning & Development
            </h1>
            <p className="text-gray-400 mt-2">Interactive quizzes, badges, and skill development</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{progress.quizzesCompleted}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{progress.badgesEarned}/{progress.totalBadges}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Badges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{progress.averageScore}%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Avg Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Trophy className="h-4 w-4" /> },
            { id: 'quizzes', label: 'Quizzes', icon: <Play className="h-4 w-4" /> },
            { id: 'badges', label: 'Badges', icon: <Award className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Play className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{progress.quizzesCompleted}/{progress.totalAttempts}</div>
                  <div className="text-sm text-gray-400">Total Quizzes Attempted</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{progress.badgesEarned}/{progress.totalBadges}</div>
                  <div className="text-sm text-gray-400">Badges Earned</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{progress.averageScore}%</div>
                  <div className="text-sm text-gray-400">Average Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 shadow-2xl rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(activity.category)}
                      <div>
                        <div className="text-white font-medium">{activity.quizTitle}</div>
                        <div className="text-gray-400 text-sm">Completed on {new Date(activity.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${activity.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {activity.score}%
                      </div>
                      <div className="text-gray-400 text-xs">{activity.passed ? 'Passed' : 'Failed'}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === 'quizzes' && (
        <div className="bg-white/10 shadow-2xl rounded-xl p-6 animate-in fade-in duration-500">
          <h2 className="text-xl font-bold text-white mb-6">Available Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-purple-500/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(quiz.category)}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{quiz.description}</p>
                    </div>
                  </div>
                  {quiz.completed && <CheckCircle className="h-6 w-6 text-green-400" />}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-400">Questions</div>
                    <div className="text-white font-medium">{quiz.questionsCount}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Time Limit</div>
                    <div className="text-white font-medium">{quiz.timeLimit} min</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                  {quiz.completed && (
                    <div className="text-right">
                      <div className="text-white font-bold">{quiz.bestScore}%</div>
                      <div className="text-gray-400 text-xs">Best Score</div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => startQuiz(quiz.id)}
                  className={`w-full py-2.5 rounded-lg font-medium transition-colors ${quiz.completed
                    ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                >
                  {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="bg-white/10 shadow-2xl rounded-xl p-6 animate-in fade-in duration-500">
          <h2 className="text-xl font-bold text-white mb-6">Achievement Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className={`bg-white/5 border rounded-lg p-6 text-center ${badge.earned ? 'border-yellow-400/30 bg-yellow-900/10' : 'border-white/10'
                }`}>
                <div className="text-4xl mb-3 grayscale-0">{badge.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{badge.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{badge.description}</p>

                {badge.earned && (
                  <div className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    Unlocked
                  </div>
                )}
                {!badge.earned && (
                  <div className="text-gray-500 text-xs flex items-center justify-center gap-1">
                    <Trophy size={12} /> Locked
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLearning;