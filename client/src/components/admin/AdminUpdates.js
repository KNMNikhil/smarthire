import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, Users, Building2, Bell, Plus, Edit, Trash2 } from 'lucide-react';

const AdminUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    description: '',
    type: 'announcement',
    status: 'Draft'
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/admin/updates');
      const data = await response.json();
      setUpdates(data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpdate = () => {
    const update = {
      id: updates.length + 1,
      ...newUpdate,
      date: new Date().toISOString().split('T')[0]
    };
    setUpdates([update, ...updates]);
    setNewUpdate({
      title: '',
      description: '',
      type: 'announcement',
      status: 'Draft'
    });
    setShowAddModal(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setUpdates(updates.map(update => 
      update.id === id ? { ...update, status: newStatus } : update
    ));
  };

  const handleDelete = (id) => {
    setUpdates(updates.filter(update => update.id !== id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'placement': return <Users className="h-5 w-5 text-green-600" />;
      case 'drive': return <Building2 className="h-5 w-5 text-blue-600" />;
      case 'announcement': return <Bell className="h-5 w-5 text-purple-600" />;
      case 'event': return <Calendar className="h-5 w-5 text-orange-600" />;
      default: return <RefreshCw className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'placement': return 'bg-green-900 text-white';
      case 'drive': return 'bg-blue-900 text-white';
      case 'announcement': return 'bg-purple-900 text-white';
      case 'event': return 'bg-orange-900 text-white';
      default: return 'bg-gray-900 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-900 text-white';
      case 'Draft': return 'bg-yellow-900 text-white';
      case 'Scheduled': return 'bg-blue-900 text-white';
      default: return 'bg-gray-900 text-white';
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
      <div className="bg-white/10 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">System Updates</h1>
            <p className="text-gray-400">Manage placement updates and announcements</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Update
          </button>
        </div>
      </div>

      {/* Updates Grid */}
      <div className="grid grid-cols-1 gap-6">
        {updates.map((update) => (
          <div key={update.id} className="bg-white/8 shadow-lg shadow-black/25 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-white">{getTypeIcon(update.type)}</div>
                  <h3 className="text-lg font-semibold text-white">{update.title}</h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium shadow-none ${getTypeColor(update.type)}`}>
                    {update.type}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium shadow-none ${getStatusColor(update.status)}`}>
                    {update.status}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-4">{update.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(update.date).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {update.status === 'Draft' && (
                      <button
                        onClick={() => handleStatusChange(update.id, 'Published')}
                        className="bg-green-600/80 backdrop-blur-sm text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-all duration-200"
                      >
                        Publish
                      </button>
                    )}
                    {update.status === 'Published' && (
                      <button
                        onClick={() => handleStatusChange(update.id, 'Draft')}
                        className="bg-yellow-600/80 backdrop-blur-sm text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-all duration-200"
                      >
                        Unpublish
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(update.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Update Modal */}
      {showAddModal && (
        <div className="fixed inset-0 w-full h-full bg-black/70 backdrop-blur-md flex items-center justify-center p-4" style={{zIndex: 9999}}>
          <div className="bg-black/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl w-full max-w-4xl">
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">
                Add New Update
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAddUpdate(); }} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={newUpdate.title}
                    onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Enter update title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Type *</label>
                  <select
                    value={newUpdate.type}
                    onChange={(e) => setNewUpdate({...newUpdate, type: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    <option value="announcement" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Announcement</option>
                    <option value="placement" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Placement</option>
                    <option value="drive" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Drive</option>
                    <option value="event" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Status</label>
                  <select
                    value={newUpdate.status}
                    onChange={(e) => setNewUpdate({...newUpdate, status: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    <option value="Draft" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Draft</option>
                    <option value="Published" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Published</option>
                    <option value="Scheduled" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Description *</label>
                  <textarea
                    required
                    value={newUpdate.description}
                    onChange={(e) => setNewUpdate({...newUpdate, description: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Enter update description"
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-3 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Add Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpdates;