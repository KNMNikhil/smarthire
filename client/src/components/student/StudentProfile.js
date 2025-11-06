import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/apiService';
import { User, Edit, Save, X } from 'lucide-react';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      const response = await studentService.getProfile();
      console.log('Profile response:', response);
      const profileData = response.data || response;
      console.log('Profile data:', profileData);
      setProfile(profileData);
      setFormData(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.error('Error details:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(profile);
  };

  const handleSave = async () => {
    try {
      console.log('Sending profile data:', formData);
      const response = await studentService.updateProfile(formData);
      console.log('Update response:', response);
      setProfile(formData);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-gray-400">Manage your personal and academic information</p>
          </div>
          {!editing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600/80 backdrop-blur-sm hover:bg-purple-600 transition-all duration-200"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600/80 backdrop-blur-sm hover:bg-purple-600 transition-all duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white whitespace-nowrap">{profile?.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white">{profile?.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Roll Number</label>
            {editing ? (
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo || ''}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white whitespace-nowrap">{profile?.rollNo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
            {editing ? (
              <input
                type="date"
                name="dob"
                value={formData.dob || ''}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white">{profile?.dob ? new Date(profile.dob).toLocaleDateString() : 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">CGPA</label>
            {editing ? (
              <input
                type="number"
                step="0.01"
                name="cgpa"
                value={formData.cgpa || ''}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white">{profile?.cgpa || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">10th Percentage</label>
            {editing ? (
              <input
                type="number"
                step="0.01"
                name="tenthPercentage"
                value={formData.tenthPercentage || ''}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white">{profile?.tenthPercentage || 'Not set'}%</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">12th Percentage</label>
            {editing ? (
              <input
                type="number"
                step="0.01"
                name="twelfthPercentage"
                value={formData.twelfthPercentage || ''}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white">{profile?.twelfthPercentage || 'Not set'}%</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
            {editing ? (
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white">{profile?.age || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Semester</label>
            {editing ? (
              <select
                name="currentSemester"
                value={formData.currentSemester || ''}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              >
                <option value="">Select Semester</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
              </select>
            ) : (
              <p className="text-white">{profile?.currentSemester ? `${profile.currentSemester}th Semester` : 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Arrears</label>
            {editing ? (
              <input
                type="number"
                name="arrears"
                value={formData.arrears || 0}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white">{profile?.arrears || 0}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Internship</label>
            {editing ? (
              <select
                name="internship"
                value={formData.internship ? 'true' : 'false'}
                onChange={(e) => setFormData({...formData, internship: e.target.value === 'true'})}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            ) : (
              <p className="text-white">{profile?.internship ? 'Yes' : 'No'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Batch</label>
            {editing ? (
              <input
                type="text"
                name="batch"
                value={formData.batch || ''}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            ) : (
              <p className="text-white">{profile?.batch}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Placement Status</label>
            {editing ? (
              <select
                name="placedStatus"
                value={formData.placedStatus || 'Not Placed'}
                onChange={handleChange}
                className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              >
                <option value="Not Placed">Not Placed</option>
                <option value="Placed (General)">Placed (General)</option>
                <option value="Placed (Dream)">Placed (Dream)</option>
                <option value="Placed (Super Dream)">Placed (Super Dream)</option>
                <option value="Higher Studies">Higher Studies</option>
              </select>
            ) : (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                {profile?.placedStatus}
              </span>
            )}
          </div>
        </div>

        {/* Semester-wise GPA Section */}
        {(profile?.currentSemester || editing) && (
          <div className="bg-white/8 backdrop-blur-sm border border-gray-400/20 shadow-lg shadow-black/25 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-medium text-white mb-4">Semester-wise GPA</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: parseInt(profile?.currentSemester || formData.currentSemester || 0) - 1 }, (_, i) => (
                <div key={i + 1}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Semester {i + 1} GPA
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      step="0.01"
                      name={`sem${i + 1}Gpa`}
                      value={formData[`sem${i + 1}Gpa`] || ''}
                      onChange={handleChange}
                      className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                    />
                  ) : (
                    <p className="text-white">{profile?.[`sem${i + 1}Gpa`] || 'Not set'}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;