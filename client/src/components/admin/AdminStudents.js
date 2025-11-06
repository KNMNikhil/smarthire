import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/apiService';
import { Users, Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    placementStatus: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    cgpa: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    dob: '',
    age: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    sem1Gpa: '',
    sem2Gpa: '',
    sem3Gpa: '',
    sem4Gpa: '',
    sem5Gpa: '',
    sem6Gpa: '',
    cgpa: '',
    arrears: '',
    batch: '2022-2026',
    placedStatus: 'Not Placed',
    department: 'CSE'
  });

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm, filters]);

  const fetchStudents = async () => {
    try {
      const response = await adminService.getStudents();
      let filteredStudents = response.data;
      
      // Apply filters
      filteredStudents = filteredStudents.filter(student => {
        const matchesSearch = !searchTerm || 
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesPlacement = true;
        if (filters.placementStatus) {
          if (filters.placementStatus === 'Placed') {
            matchesPlacement = ['Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(student.placedStatus);
          } else if (['General', 'Dream', 'Super Dream'].includes(filters.placementStatus)) {
            matchesPlacement = student.placedStatus === `Placed - ${filters.placementStatus}`;
          } else {
            matchesPlacement = student.placedStatus === filters.placementStatus;
          }
        }
        
        const matchesTenth = !filters.tenthPercentage || 
          (filters.tenthPercentage === 'above60' && parseFloat(student.tenthPercentage) >= 60) ||
          (filters.tenthPercentage === 'below60' && parseFloat(student.tenthPercentage) < 60);
        
        const matchesTwelfth = !filters.twelfthPercentage || 
          (filters.twelfthPercentage === 'above60' && parseFloat(student.twelfthPercentage) >= 60) ||
          (filters.twelfthPercentage === 'below60' && parseFloat(student.twelfthPercentage) < 60);
        
        const matchesCgpa = !filters.cgpa || 
          (filters.cgpa === 'above6' && parseFloat(student.cgpa) >= 6) ||
          (filters.cgpa === 'below6' && parseFloat(student.cgpa) < 6);
        
        return matchesSearch && matchesPlacement && matchesTenth && matchesTwelfth && matchesCgpa;
      });
      
      setStudents(filteredStudents);
      setTotalPages(Math.ceil(filteredStudents.length / 10));
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await adminService.deleteStudent(id);
        fetchStudents();
        alert('Student deleted successfully');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await adminService.updateStudent(editingStudent.id, formData);
        alert('Student updated successfully');
      } else {
        await adminService.addStudent(formData);
        alert('Student added successfully');
      }
      setShowAddModal(false);
      setEditingStudent(null);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      rollNo: '',
      dob: '',
      age: '',
      tenthPercentage: '',
      twelfthPercentage: '',
      sem1Gpa: '',
      sem2Gpa: '',
      sem3Gpa: '',
      sem4Gpa: '',
      sem5Gpa: '',
      sem6Gpa: '',
      cgpa: '',
      arrears: '',
      batch: '2022-2026',
      placedStatus: 'Not Placed',
      department: 'CSE'
    });
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-900 text-black';
    
    if (status === 'Not Placed') return 'bg-red-900 text-black';
    if (status === 'Higher Studies') return 'bg-yellow-500 text-black';
    if (status.includes('Placed') || status === 'General' || status === 'Dream' || status === 'Super Dream') {
      return 'bg-green-600 text-black';
    }
    
    return 'bg-gray-900 text-black';
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
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Student Management</h1>
            <p className="text-gray-400">Manage student records and placement status</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Student Statistics</h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            <div className="text-xs text-gray-400">Total Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{students.filter(s => ['Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(s.placedStatus)).length}</div>
            <div className="text-xs text-gray-400">Placed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{students.filter(s => s.placedStatus === 'Higher Studies').length}</div>
            <div className="text-xs text-gray-400">Higher Studies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{students.filter(s => s.placedStatus === 'Not Placed').length}</div>
            <div className="text-xs text-gray-400">Not Placed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{students.filter(s => parseInt(s.arrears) > 0).length}</div>
            <div className="text-xs text-gray-400">With Arrears</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-6">
        <div className="space-y-4">
          {/* Main Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, roll number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
            />
          </div>
          
          {/* Filters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select
              value={filters.placementStatus}
              onChange={(e) => setFilters({...filters, placementStatus: e.target.value})}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            >
              <option value="" className="bg-black/80 backdrop-blur-sm text-white">All Placement Status</option>
              <option value="Not Placed" className="bg-black/80 backdrop-blur-sm text-white">Not Placed</option>
              <option value="Placed" className="bg-black/80 backdrop-blur-sm text-white">All Placed</option>
              <option value="General" className="bg-black/80 backdrop-blur-sm text-white">Placed - General</option>
              <option value="Dream" className="bg-black/80 backdrop-blur-sm text-white">Placed - Dream</option>
              <option value="Super Dream" className="bg-black/80 backdrop-blur-sm text-white">Placed - Super Dream</option>
              <option value="Higher Studies" className="bg-black/80 backdrop-blur-sm text-white">Higher Studies</option>
            </select>
            <select
              value={filters.tenthPercentage}
              onChange={(e) => setFilters({...filters, tenthPercentage: e.target.value})}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            >
              <option value="" className="bg-black/80 backdrop-blur-sm text-white">All 10th Percentage</option>
              <option value="above60" className="bg-black/80 backdrop-blur-sm text-white">Above 60%</option>
              <option value="below60" className="bg-black/80 backdrop-blur-sm text-white">Below 60%</option>
            </select>
            <select
              value={filters.twelfthPercentage}
              onChange={(e) => setFilters({...filters, twelfthPercentage: e.target.value})}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            >
              <option value="" className="bg-black/80 backdrop-blur-sm text-white">All 12th Percentage</option>
              <option value="above60" className="bg-black/80 backdrop-blur-sm text-white">Above 60%</option>
              <option value="below60" className="bg-black/80 backdrop-blur-sm text-white">Below 60%</option>
            </select>
            <select
              value={filters.cgpa}
              onChange={(e) => setFilters({...filters, cgpa: e.target.value})}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            >
              <option value="" className="bg-black/80 backdrop-blur-sm text-white">All CGPA</option>
              <option value="above6" className="bg-black/80 backdrop-blur-sm text-white">Above 6.0</option>
              <option value="below6" className="bg-black/80 backdrop-blur-sm text-white">Below 6.0</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 overflow-hidden rounded-xl">
        <div className="px-4 py-5 sm:px-6 border-b border-white/20">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-white">
              Students ({students.length})
            </h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Academic Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Placement Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-400/20">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          src={student.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                          alt="Student Avatar" 
                          className="w-10 h-10 rounded-full object-cover border-2 border-purple-600"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{student.name}</div>
                        <div className="text-sm text-gray-400">{student.email}</div>
                        <div className="text-sm text-gray-400">Roll: {student.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div>
                      <div>CGPA: {student.cgpa || 'N/A'}</div>
                      <div>10th: {student.tenthPercentage || 'N/A'}%</div>
                      <div>12th: {student.twelfthPercentage || 'N/A'}%</div>
                      <div>Arrears: {student.arrears || 0}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium shadow-none ${getStatusColor(student.placedStatus)}`}>
                      {student.placedStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-purple-700 hover:text-purple-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-900"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {students.length === 0 && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Students Found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm ? 'No students match your search criteria.' : 'Get started by adding your first student.'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                    <input
                      type="text"
                      required
                      value={formData.rollNo}
                      onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">10th Percentage</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.tenthPercentage}
                      onChange={(e) => setFormData({...formData, tenthPercentage: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">12th Percentage</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.twelfthPercentage}
                      onChange={(e) => setFormData({...formData, twelfthPercentage: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.cgpa}
                      onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sem 1 GPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.sem1Gpa}
                      onChange={(e) => setFormData({...formData, sem1Gpa: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sem 2 GPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.sem2Gpa}
                      onChange={(e) => setFormData({...formData, sem2Gpa: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sem 3 GPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.sem3Gpa}
                      onChange={(e) => setFormData({...formData, sem3Gpa: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sem 4 GPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.sem4Gpa}
                      onChange={(e) => setFormData({...formData, sem4Gpa: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sem 5 GPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.sem5Gpa}
                      onChange={(e) => setFormData({...formData, sem5Gpa: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sem 6 GPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.sem6Gpa}
                      onChange={(e) => setFormData({...formData, sem6Gpa: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Arrears</label>
                    <input
                      type="number"
                      required
                      value={formData.arrears}
                      onChange={(e) => setFormData({...formData, arrears: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Batch</label>
                    <select
                      value={formData.batch}
                      onChange={(e) => setFormData({...formData, batch: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="2022-2026">2022-2026</option>
                      <option value="2021-2025">2021-2025</option>
                      <option value="2023-2027">2023-2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="MECH">MECH</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Placement Status</label>
                    <select
                      value={formData.placedStatus}
                      onChange={(e) => setFormData({...formData, placedStatus: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Not Placed">Not Placed</option>
                      <option value="General">Placed - General</option>
                      <option value="Dream">Placed - Dream</option>
                      <option value="Super Dream">Placed - Super Dream</option>
                      <option value="Higher Studies">Higher Studies</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingStudent(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingStudent ? 'Update' : 'Add'} Student
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

export default AdminStudents;