import React, { useState, useEffect } from 'react';
import { companyService } from '../../services/apiService';
import { Building2, Plus, Search, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';

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
    type: 'General',
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
        type: 'General',
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
    setFormData(company);
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
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
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
          <div key={company.id} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 overflow-hidden rounded-xl">
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
              </div>

              <div className="mt-4 bg-white/8 backdrop-blur-sm p-3 rounded-md">
                <h4 className="text-sm font-medium text-white mb-2">Eligibility Criteria</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div>Min CGPA: {company.minCgpa}</div>
                  <div>Max Arrears: {company.maxArrears}</div>
                  <div>10th Min: {company.tenthMin}%</div>
                  <div>12th Min: {company.twelfthMin}%</div>
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
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-12 text-center">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-start justify-center pt-8 z-50">
          <div className="bg-white shadow-2xl w-full max-w-6xl">
            <div className="px-6 pb-6">
              <div className="flex justify-between items-center mb-6 pt-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCompany ? 'Edit Company' : 'Add New Company'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Role</label>
                    <input
                      type="text"
                      required
                      value={formData.jobRole}
                      onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Package</label>
                    <input
                      type="text"
                      required
                      value={formData.package}
                      onChange={(e) => setFormData({...formData, package: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Visit Date</label>
                    <input
                      type="date"
                      required
                      value={formData.visitDate}
                      onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="General">General</option>
                      <option value="Dream">Dream</option>
                      <option value="Super Dream">Super Dream</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.minCgpa}
                      onChange={(e) => setFormData({...formData, minCgpa: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Last Sem GPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.minLastSemGpa}
                      onChange={(e) => setFormData({...formData, minLastSemGpa: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Arrears</label>
                    <input
                      type="number"
                      required
                      value={formData.maxArrears}
                      onChange={(e) => setFormData({...formData, maxArrears: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Require Internship</label>
                    <select
                      value={formData.requireInternship}
                      onChange={(e) => setFormData({...formData, requireInternship: e.target.value === 'true'})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={false}>No</option>
                      <option value={true}>Yes</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">10th Min %</label>
                    <input
                      type="number"
                      required
                      value={formData.tenthMin}
                      onChange={(e) => setFormData({...formData, tenthMin: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">12th Min %</label>
                    <input
                      type="number"
                      required
                      value={formData.twelfthMin}
                      onChange={(e) => setFormData({...formData, twelfthMin: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
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
                        type: 'General',
                        minCgpa: '',
                        minLastSemGpa: '',
                        maxArrears: '',
                        tenthMin: '',
                        twelfthMin: '',

                        requireInternship: false
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingCompany ? 'Update' : 'Add'} Company
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploads;