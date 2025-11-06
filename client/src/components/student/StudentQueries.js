import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/apiService';
import { HelpCircle, Plus, Send, Clock, CheckCircle, MessageSquare } from 'lucide-react';

const StudentQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewQuery, setShowNewQuery] = useState(false);
  const [newQuery, setNewQuery] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await studentService.getQueries();
      setQueries(response.data);
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await studentService.createQuery(newQuery);
      setNewQuery({ subject: '', message: '' });
      setShowNewQuery(false);
      fetchQueries();
    } catch (error) {
      console.error('Error submitting query:', error);
      alert('Failed to submit query');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Replied':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Replied':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2 pt-0">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Queries</h1>
            <p className="text-gray-400">Ask questions and get help from the placement team</p>
          </div>
          <button
            onClick={() => setShowNewQuery(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600/80 backdrop-blur-sm hover:bg-purple-600 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Query
          </button>
        </div>
      </div>

      {/* New Query Form */}
      {showNewQuery && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Submit New Query</h2>
          <form onSubmit={handleSubmitQuery} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                required
                value={newQuery.subject}
                onChange={(e) => setNewQuery({ ...newQuery, subject: e.target.value })}
                className="mt-1 block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                placeholder="Enter query subject"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                required
                value={newQuery.message}
                onChange={(e) => setNewQuery({ ...newQuery, message: e.target.value })}
                className="mt-1 block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                placeholder="Describe your query in detail"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewQuery(false)}
                className="px-4 py-2 text-gray-300 hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600/80 backdrop-blur-sm hover:bg-purple-600 disabled:opacity-50 transition-all duration-200"
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Query
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Queries List */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 overflow-hidden rounded-xl">
        <div className="px-6 py-6 border-b border-white/20">
          <h3 className="text-xl leading-6 font-semibold text-white">
            Query History ({queries.length})
          </h3>
        </div>
        
        {queries.length > 0 ? (
          <div className="divide-y divide-white/10">
            {queries.map((query) => (
              <div key={query.id} className="px-6 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(query.status)}
                      <h3 className="text-sm font-medium text-white">{query.subject}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                        {query.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{query.message}</p>
                    
                    {query.reply && (
                      <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-lg p-3 mt-3">
                        <div className="flex items-center mb-2">
                          <MessageSquare className="h-4 w-4 text-purple-300 mr-2" />
                          <span className="text-sm font-medium text-purple-200">Admin Reply</span>
                        </div>
                        <p className="text-sm text-purple-100">{query.reply}</p>
                        {query.repliedAt && (
                          <p className="text-xs text-purple-300 mt-2">
                            Replied on {new Date(query.repliedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0 text-sm text-gray-400">
                    {new Date(query.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Queries Yet</h3>
            <p className="text-gray-400 mb-4">
              You haven't submitted any queries. Ask questions to get help from the placement team.
            </p>
            <button
              onClick={() => setShowNewQuery(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600/80 backdrop-blur-sm hover:bg-purple-600 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Submit Your First Query
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQueries;