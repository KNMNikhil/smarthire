import React, { useState, useEffect } from 'react';
import { Bus, Plus, Edit, Trash2, MapPin, Clock, Users, Calendar } from 'lucide-react';

const AdminBus = () => {
  const [busRoutes, setBusRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    companyId: '',
    company: '',
    date: '',
    time: '',
    timeAmPm: 'AM',
    boardingPoint: 'College Main Gate',
    destination: '',
    busNumber: '',
    capacity: 50,
    estimatedTravel: '',
    returnTime: '',
    returnTimeAmPm: 'PM',
    contactPerson: '',
    status: 'scheduled'
  });

  useEffect(() => {
    fetchBusRoutes();
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      // Mock companies - replace with actual API
      setCompanies([
        { id: 1, name: 'Amazon' },
        { id: 2, name: 'Google' },
        { id: 3, name: 'Microsoft' },
        { id: 4, name: 'TCS' },
        { id: 5, name: 'Infosys' }
      ]);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchBusRoutes = async () => {
    try {
      // Load existing routes from localStorage
      const savedRoutes = JSON.parse(localStorage.getItem('busRoutes') || '[]');
      setBusRoutes(savedRoutes);
    } catch (error) {
      console.error('Error fetching bus routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedRoutes;
      if (editingRoute) {
        // Update existing route
        updatedRoutes = busRoutes.map(route => 
          route.id === editingRoute.id 
            ? { ...route, ...formData, registered: route.registered }
            : route
        );
        alert('Bus route updated successfully!');
      } else {
        // Add new route
        const newRoute = {
          id: Date.now(), // Use timestamp as ID
          ...formData,
          registered: 0
        };
        updatedRoutes = [...busRoutes, newRoute];
        alert('Bus route added successfully!');
      }
      
      setBusRoutes(updatedRoutes);
      // Save to localStorage so students can access
      localStorage.setItem('busRoutes', JSON.stringify(updatedRoutes));
      
      setShowModal(false);
      setEditingRoute(null);
      resetForm();
    } catch (error) {
      console.error('Error saving bus route:', error);
      alert('Failed to save bus route');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      companyId: route.companyId,
      company: route.company,
      date: route.date,
      time: route.time,
      boardingPoint: route.boardingPoint,
      busNumber: route.busNumber,
      capacity: route.capacity,
      estimatedTravel: route.estimatedTravel,
      returnTime: route.returnTime,
      contactPerson: route.contactPerson,
      status: route.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus route?')) {
      const updatedRoutes = busRoutes.filter(route => route.id !== id);
      setBusRoutes(updatedRoutes);
      localStorage.setItem('busRoutes', JSON.stringify(updatedRoutes));
      alert('Bus route deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      companyId: '',
      company: '',
      date: '',
      time: '',
      timeAmPm: 'AM',
      boardingPoint: 'College Main Gate',
      destination: '',
      busNumber: '',
      capacity: 50,
      estimatedTravel: '',
      returnTime: '',
      returnTimeAmPm: 'PM',
      contactPerson: '',
      status: 'scheduled'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-900/30 text-blue-400 border-blue-400/30';
      case 'departed': return 'bg-yellow-900/30 text-yellow-400 border-yellow-400/30';
      case 'returned': return 'bg-green-900/30 text-green-400 border-green-400/30';
      case 'cancelled': return 'bg-red-900/30 text-red-400 border-red-400/30';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
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
              <Bus className="h-8 w-8 text-purple-400" />
              Bus Facility Management
            </h1>
            <p className="text-gray-400 mt-2">Manage transportation for off-campus placement drives</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Bus Route
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Bus className="h-8 w-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">{busRoutes.length}</div>
              <div className="text-sm text-gray-400">Total Routes</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-white">{busRoutes.filter(r => r.status === 'scheduled').length}</div>
              <div className="text-sm text-gray-400">Scheduled</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">{busRoutes.reduce((sum, r) => sum + r.registered, 0)}</div>
              <div className="text-sm text-gray-400">Total Registered</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-8 w-8 text-orange-400" />
            <div>
              <div className="text-2xl font-bold text-white">{busRoutes.reduce((sum, r) => sum + r.capacity, 0)}</div>
              <div className="text-sm text-gray-400">Total Capacity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bus Routes Table */}
      <div className="bg-white/10 shadow-2xl rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Bus Routes</h2>
        
        {busRoutes.length === 0 ? (
          <div className="text-center py-12">
            <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Bus Routes</h3>
            <p className="text-gray-400 mb-4">Add bus routes for upcoming placement drives</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add First Route
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date & Time</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Bus Details</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Capacity</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {busRoutes.map((route) => (
                  <tr key={route.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-white font-medium">{route.company}</div>
                        <div className="text-gray-400 text-sm">{route.contactPerson}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-white">{new Date(route.date).toLocaleDateString()}</div>
                        <div className="text-gray-400 text-sm">
                          Dep: {route.time} | Ret: {route.returnTime}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-white">{route.busNumber}</div>
                        <div className="text-gray-400 text-sm">Travel: {route.estimatedTravel}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-white">{route.registered}/{route.capacity}</div>
                        <div className="text-gray-400 text-sm">
                          {route.capacity - route.registered} available
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(route.status)}`}>
                        {route.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(route)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-black/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">
                {editingRoute ? 'Edit Bus Route' : 'Add Bus Route'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingRoute(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Company *</label>
                  <select
                    required
                    value={formData.companyId}
                    onChange={(e) => {
                      const selectedCompany = companies.find(c => c.id === parseInt(e.target.value));
                      setFormData({
                        ...formData, 
                        companyId: e.target.value,
                        company: selectedCompany ? selectedCompany.name : ''
                      });
                    }}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    <option value="" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Select Company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id} style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>{company.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Bus Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.busNumber}
                    onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="TN 07 AB 1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Departure Time *</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                    />
                    <select
                      required
                      value={formData.timeAmPm || 'AM'}
                      onChange={(e) => setFormData({...formData, timeAmPm: e.target.value})}
                      className="px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                    >
                      <option value="AM" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>AM</option>
                      <option value="PM" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Return Time *</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      required
                      value={formData.returnTime}
                      onChange={(e) => setFormData({...formData, returnTime: e.target.value})}
                      className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                    />
                    <select
                      required
                      value={formData.returnTimeAmPm || 'PM'}
                      onChange={(e) => setFormData({...formData, returnTimeAmPm: e.target.value})}
                      className="px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                    >
                      <option value="AM" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>AM</option>
                      <option value="PM" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Capacity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Boarding Point *</label>
                  <input
                    type="text"
                    required
                    value={formData.boardingPoint}
                    onChange={(e) => setFormData({...formData, boardingPoint: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="College Main Gate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={formData.destination || ''}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Company Office Location"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Estimated Travel Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.estimatedTravel}
                    onChange={(e) => setFormData({...formData, estimatedTravel: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="2 hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    <option value="scheduled" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Scheduled</option>
                    <option value="departed" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Departed</option>
                    <option value="returned" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Returned</option>
                    <option value="cancelled" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Contact Person *</label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Mr. John - 9876543210"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-3 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRoute(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  {editingRoute ? 'Update' : 'Add'} Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBus;