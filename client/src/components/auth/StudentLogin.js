import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { SignInPage } from '../ui/sign-in';
import { X } from 'lucide-react';

const StudentLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '', email: '', password: '', confirmPassword: '', rollNo: '', dob: '',
    cgpa: '', tenthPercentage: '', twelfthPercentage: '', age: '', currentSemester: '',
    sem1Gpa: '', sem2Gpa: '', sem3Gpa: '', sem4Gpa: '', sem5Gpa: '', sem6Gpa: '',
    arrears: 0, higherStudies: false, internship: false, batch: '', placedStatus: 'Not Placed'
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Form data:', data);

    try {
      const response = await login(data, 'student');
      console.log('Login successful:', response);
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    alert('Google Sign In - Feature coming soon!');
  };

  const handleResetPassword = () => {
    navigate('/forgot-password');
  };

  const handleCreateAccount = () => {
    setShowRegisterModal(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      await authService.registerStudent(registerData);
      alert('Registration successful! Please login with your credentials.');
      setShowRegisterModal(false);
      setRegisterData({
        name: '', email: '', password: '', confirmPassword: '', rollNo: '', dob: '',
        cgpa: '', tenthPercentage: '', twelfthPercentage: '', age: '', currentSemester: '',
        sem1Gpa: '', sem2Gpa: '', sem3Gpa: '', sem4Gpa: '', sem5Gpa: '', sem6Gpa: '',
        arrears: 0, higherStudies: false, internship: false, batch: '', placedStatus: 'Not Placed'
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData({
      ...registerData,
      [name]: type === 'checkbox' ? checked : value
    });
  };



  return (
    <>
      <SignInPage
        userType="student"
        heroImageSrc="/image.png"
        onSignIn={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
      
      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-black/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">Student Registration</h2>
              <button onClick={() => setShowRegisterModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleRegisterSubmit} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-white mb-1">Name *</label><input type="text" name="name" placeholder="Enter full name" required value={registerData.name} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-xs font-medium text-white mb-1">Email *</label><input type="email" name="email" placeholder="Enter email" required value={registerData.email} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-xs font-medium text-white mb-1">Password *</label><input type="password" name="password" placeholder="Create password" required value={registerData.password} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-xs font-medium text-white mb-1">Confirm Password *</label><input type="password" name="confirmPassword" placeholder="Confirm password" required value={registerData.confirmPassword} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-xs font-medium text-white mb-1">Roll Number *</label><input type="text" name="rollNo" placeholder="Enter roll number" required value={registerData.rollNo} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-xs font-medium text-white mb-1">Date of Birth *</label><input type="date" name="dob" required value={registerData.dob} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white" /></div>
                <div><label className="block text-xs font-medium text-white mb-1">CGPA *</label><input type="number" step="0.01" name="cgpa" placeholder="Enter CGPA" required value={registerData.cgpa} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-xs font-medium text-white mb-1">10th % *</label><input type="number" step="0.01" name="tenthPercentage" placeholder="10th %" required value={registerData.tenthPercentage} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-xs font-medium text-white mb-1">12th % *</label><input type="number" step="0.01" name="twelfthPercentage" placeholder="12th %" required value={registerData.twelfthPercentage} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-xs font-medium text-white mb-1">Age *</label><input type="number" name="age" placeholder="Age" required value={registerData.age} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-xs font-medium text-white mb-1">Semester *</label><select name="currentSemester" required value={registerData.currentSemester} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"><option value="" style={{backgroundColor: '#000', color: '#fff'}}>Select</option><option value="7" style={{backgroundColor: '#000', color: '#fff'}}>7th Semester</option><option value="8" style={{backgroundColor: '#000', color: '#fff'}}>8th Semester</option></select></div>
                <div><label className="block text-xs font-medium text-white mb-1">Batch *</label><input type="text" name="batch" placeholder="2025-2026" required value={registerData.batch} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" /></div>
              </div>
              
              {registerData.currentSemester && (
                <div>
                  <label className="block text-xs font-medium text-white mb-2">Semester GPA *</label>
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: parseInt(registerData.currentSemester) - 1 }, (_, i) => (
                      <input key={i + 1} type="number" step="0.01" name={`sem${i + 1}Gpa`} placeholder={`Sem ${i + 1}`} required value={registerData[`sem${i + 1}Gpa`]} onChange={handleRegisterChange} className="w-full px-2 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-medium text-white mb-1">Arrears</label><input type="number" name="arrears" placeholder="0" value={registerData.arrears} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-xs font-medium text-white mb-1">Internship</label><select name="internship" value={registerData.internship} onChange={(e) => setRegisterData({...registerData, internship: e.target.value === 'true'})} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"><option value={false} style={{backgroundColor: '#000', color: '#fff'}}>No</option><option value={true} style={{backgroundColor: '#000', color: '#fff'}}>Yes</option></select></div>
                <div><label className="block text-xs font-medium text-white mb-1">Placement Status</label><select name="placedStatus" value={registerData.placedStatus} onChange={handleRegisterChange} className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"><option value="Not Placed" style={{backgroundColor: '#000', color: '#fff'}}>Not Placed</option><option value="General" style={{backgroundColor: '#000', color: '#fff'}}>Placed - General</option><option value="Dream" style={{backgroundColor: '#000', color: '#fff'}}>Placed - Dream</option><option value="Super Dream" style={{backgroundColor: '#000', color: '#fff'}}>Placed - Super Dream</option><option value="Higher Studies" style={{backgroundColor: '#000', color: '#fff'}}>Higher Studies</option></select></div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-3 border-t border-white/20">
                <button type="button" onClick={() => setShowRegisterModal(false)} className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded text-white hover:bg-white/20">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentLogin;