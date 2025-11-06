import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNo: '',
    dob: '',
    cgpa: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    age: '',
    currentSemester: '',
    sem1Gpa: '',
    sem2Gpa: '',
    sem3Gpa: '',
    sem4Gpa: '',
    sem5Gpa: '',
    sem6Gpa: '',
    sem7Gpa: '',
    arrears: '',
    higherStudies: false,
    internship: false,
    batch: '',
    placedStatus: 'Not Placed'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authService.registerStudent(formData);
      alert('Registration successful! Please login with your credentials.');
      navigate('/student/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-black/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl w-full max-w-4xl">
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Student Registration</h2>
          <Link to="/student/login" className="text-white/60 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>

        {error && (
          <div className="mx-4 mt-4 bg-red-500/20 border border-red-500/50 text-red-300 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white mb-1">Name *</label>
              <input type="text" name="name" placeholder="Enter full name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Email *</label>
              <input type="email" name="email" placeholder="Enter email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Password *</label>
              <input type="password" name="password" placeholder="Create password" required value={formData.password} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Confirm Password *</label>
              <input type="password" name="confirmPassword" placeholder="Confirm password" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Roll Number *</label>
              <input type="text" name="rollNo" placeholder="Enter roll number" required value={formData.rollNo} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Date of Birth *</label>
              <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">CGPA *</label>
              <input type="number" step="0.01" name="cgpa" placeholder="Enter CGPA" required value={formData.cgpa} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">10th % *</label>
              <input type="number" step="0.01" name="tenthPercentage" placeholder="10th %" required value={formData.tenthPercentage} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">12th % *</label>
              <input type="number" step="0.01" name="twelfthPercentage" placeholder="12th %" required value={formData.twelfthPercentage} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Age *</label>
              <input type="number" name="age" placeholder="Age" required value={formData.age} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Semester *</label>
              <select name="currentSemester" required value={formData.currentSemester} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white">
                <option value="">Select</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Batch *</label>
              <input type="text" name="batch" placeholder="2025-2026" required value={formData.batch} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
            </div>
          </div>
          
          {formData.currentSemester && (
            <div>
              <label className="block text-xs font-medium text-white mb-2">Semester GPA *</label>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: parseInt(formData.currentSemester) - 1 }, (_, i) => (
                  <input
                    key={i + 1}
                    type="number"
                    step="0.01"
                    name={`sem${i + 1}Gpa`}
                    placeholder={`Sem ${i + 1}`}
                    required
                    value={formData[`sem${i + 1}Gpa`]}
                    onChange={handleChange}
                    className="w-full px-2 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white mb-1">Arrears</label>
              <input type="number" name="arrears" placeholder="0" value={formData.arrears} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Internship</label>
              <select name="internship" value={formData.internship} onChange={(e) => setFormData({...formData, internship: e.target.value === 'true'})} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white">
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-3 border-t border-white/20">
            <Link to="/student/login" className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded text-white hover:bg-white/20">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;