import React, { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, Clock, CheckCircle, Send } from 'lucide-react';

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/admin/queries');
      const data = await response.json();
      setQueries(data);
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (query) => {
    setSelectedQuery(query);
    setReplyText(query.reply || '');
  };

  const submitReply = () => {
    const updatedQueries = queries.map(q => 
      q.id === selectedQuery.id 
        ? { ...q, reply: replyText, status: 'Resolved' }
        : q
    );
    setQueries(updatedQueries);
    setSelectedQuery(null);
    setReplyText('');
  };

  const getStatusColor = (status) => {
    return status === 'Open' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800';
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
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Student Queries</h1>
        <p className="text-gray-400">Manage and respond to student queries</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {queries.map((query) => (
          <div key={query.id} className="bg-white/8 backdrop-blur-sm border border-gray-400/20 shadow-lg shadow-black/25 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">{query.subject}</h3>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                    {query.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">
                    <strong className="text-white">{query.studentName}</strong> ({query.rollNo})
                  </p>
                  <p className="text-gray-300">{query.message}</p>
                </div>

                {query.reply && (
                  <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 p-4 rounded-lg mb-4">
                    <p className="text-sm font-medium text-purple-300 mb-1">Admin Reply:</p>
                    <p className="text-purple-200">{query.reply}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(query.createdAt).toLocaleDateString()}
                  </div>
                  
                  {query.status === 'Open' && (
                    <button
                      onClick={() => handleReply(query)}
                      className="bg-purple-600/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all duration-200"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedQuery && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-white">Reply to Query</h3>
            <p className="text-sm text-gray-400 mb-4">
              <strong className="text-white">Subject:</strong> {selectedQuery.subject}
            </p>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              className="w-full h-32 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setSelectedQuery(null)}
                className="px-4 py-2 text-gray-300 hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={submitReply}
                className="bg-purple-600/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all duration-200 flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQueries;