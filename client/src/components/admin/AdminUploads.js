import React, { useState, useEffect } from 'react';
import { companyService, adminService } from '../../services/apiService';
import { Building2, Plus, Search, Edit, Trash2, Calendar, DollarSign, Users } from 'lucide-react';

const RegisteredStudentsList = ({ companyId }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, [companyId]);

  const fetchRegistrations = async () => {
    try {
      const response = await adminService.getCompanyRegistrations(companyId);
      setRegistrations(response.data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-xs text-gray-400">Loading...</div>;
  
  if (registrations.length === 0) {
    return <div className="text-xs text-gray-400">No registrations yet</div>;
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 mb-2">
        <Users className="h-3 w-3" />
        <span className="font-medium">{registrations.length} registered</span>
      </div>
      {registrations.slice(0, 3).map((reg) => (
        <div key={reg.id} className="text-xs">
          {reg.Student?.name} ({reg.Student?.rollNo})
        </div>
      ))}
      {registrations.length > 3 && (
        <div className="text-xs text-gray-500">+{registrations.length - 3} more</div>
      )}
    </div>
  );
};

const AdminUploads = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    jobRole: '',
    package: '',
    visitDate: '',
    registrationDeadline: '',
    type: 'General',
    location: '',
    minCgpa: '',
    minLastSemGpa: '',
    maxArrears: '',
    tenthMin: '',
    twelfthMin: '',
    requireInternship: false
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await companyService.getCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await companyService.updateCompany(editingCompany.id, formData);
        setNotification({ type: 'success', message: 'Company updated successfully' });
      } else {
        await companyService.addCompany(formData);
        setNotification({ type: 'success', message: 'Company added successfully' });
      }
      setTimeout(() => setNotification(null), 3000);
      setShowAddModal(false);
      setEditingCompany(null);
      setFormData({
        name: '',
        jobRole: '',
        package: '',
        visitDate: '',
        registrationDeadline: '',
        type: 'General',
        location: '',
        minCgpa: '',
        minLastSemGpa: '',
        maxArrears: '',
        tenthMin: '',
        twelfthMin: '',
        requireInternship: false
      });
      fetchCompanies();
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Failed to save company');
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    const criteria = company.eligibilityCriteria || {};
    setFormData({
      ...company,
      minCgpa: criteria.minCgpa || company.minCgpa || '',
      minLastSemGpa: criteria.minLastSemGpa || company.minLastSemGpa || '',
      maxArrears: criteria.maxArrears || company.maxArrears || '',
      tenthMin: criteria.minTenthPercentage || company.tenthMin || '',
      twelfthMin: criteria.minTwelfthPercentage || company.twelfthMin || '',
      requireInternship: criteria.requireInternship || company.requireInternship || false
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyService.deleteCompany(id);
        alert('Company deleted successfully');
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Failed to delete company');
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Dream': return 'bg-green-900 text-white';
      case 'Super Dream': return 'bg-purple-900 text-white';
      default: return 'bg-gray-900 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`p-4 rounded-md ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {notification.message}
        </div>
      )}
      {/* Header */}
      <div className="bg-white/10 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Company Management</h1>
            <p className="text-gray-400">Add and manage placement opportunities</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </button>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <div key={company.id} className="bg-white/10 shadow-2xl shadow-black/50 overflow-hidden rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-white">{company.name}</h3>
                    <p className="text-sm text-gray-400">{company.jobRole}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium shadow-none ${getTypeColor(company.type)}`}>
                  {company.type}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-400">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Package: {company.package}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  Visit Date: {new Date(company.visitDate).toLocaleDateString()}
                </div>
                {company.location && (
                  <div className="flex items-center text-sm text-gray-400">
                    <Building2 className="h-4 w-4 mr-2" />
                    Location: {company.location}
                  </div>
                )}
              </div>

              <div className="mt-4 bg-white/8 backdrop-blur-sm p-3 rounded-md">
                <h4 className="text-sm font-medium text-white mb-2">Registered Students</h4>
                <div className="text-xs text-gray-400">
                  <RegisteredStudentsList companyId={company.id} />
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(company)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="bg-white/10 shadow-2xl shadow-black/50 rounded-xl p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Companies Added</h3>
          <p className="text-gray-400 mb-4">Get started by adding your first company.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 w-full h-full bg-black/70 backdrop-blur-md flex items-start justify-center pt-16 p-4" style={{zIndex: 9999}}>
          <div className="bg-black/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl w-full max-w-4xl">
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">
                {editingCompany ? 'Edit Company' : 'Add New Company'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCompany(null);
                  setFormData({
                    name: '',
                    jobRole: '',
                    package: '',
                    visitDate: '',
                    registrationDeadline: '',
                    type: 'General',
                    location: '',
                    minCgpa: '',
                    minLastSemGpa: '',
                    maxArrears: '',
                    tenthMin: '',
                    twelfthMin: '',
                    requireInternship: false
                  });
                }}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Job Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.jobRole}
                    onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Enter job role"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Package *</label>
                  <input
                    type="text"
                    required
                    value={formData.package}
                    onChange={(e) => setFormData({...formData, package: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Enter package"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Visit Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.visitDate}
                    onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                    style={{colorScheme: 'dark'}}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Registration Deadline *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                    style={{colorScheme: 'dark'}}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    <option value="General" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>General</option>
                    <option value="Dream" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Dream</option>
                    <option value="Super Dream" style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Super Dream</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Min CGPA *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.minCgpa}
                    onChange={(e) => setFormData({...formData, minCgpa: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Min CGPA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Min Last Sem GPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.minLastSemGpa}
                    onChange={(e) => setFormData({...formData, minLastSemGpa: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Min last sem GPA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Max Arrears *</label>
                  <input
                    type="number"
                    required
                    value={formData.maxArrears}
                    onChange={(e) => setFormData({...formData, maxArrears: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Max arrears"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">10th Min % *</label>
                  <input
                    type="number"
                    required
                    value={formData.tenthMin}
                    onChange={(e) => setFormData({...formData, tenthMin: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="10th min %"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">12th Min % *</label>
                  <input
                    type="number"
                    required
                    value={formData.twelfthMin}
                    onChange={(e) => setFormData({...formData, twelfthMin: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="12th min %"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Require Internship</label>
                  <select
                    value={formData.requireInternship}
                    onChange={(e) => setFormData({...formData, requireInternship: e.target.value === 'true'})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    <option value={false} style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>No</option>
                    <option value={true} style={{background: 'rgba(0, 0, 0, 0.9)', color: 'white'}}>Yes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCompany(null);
                    setFormData({
                      name: '',
                      jobRole: '',
                      package: '',
                      visitDate: '',
                      registrationDeadline: '',
                      registrationLink: '',
                      type: 'General',
                      minCgpa: '',
                      minLastSemGpa: '',
                      maxArrears: '',
                      tenthMin: '',
                      twelfthMin: '',
                      requireInternship: false
                    });
                  }}
                  className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  {editingCompany ? 'Update' : 'Add'} Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploads;