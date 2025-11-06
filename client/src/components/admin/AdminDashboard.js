import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/apiService';
import { Users, Building2, CheckCircle, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { AdvancedStatsCard } from '../ui/advanced-stats-card';
import LoadingSpinner from '../ui/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [statsResponse, studentsResponse] = await Promise.all([
        adminService.getDashboard(),
        adminService.getStudents()
      ]);
      setStats(statsResponse.data);
      setStudents(studentsResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate accurate placement statistics
  const actualPlacedStudents = students.filter(s => 
    ['Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(s.placedStatus)
  ).length;
  const actualPlacementPercentage = students.length > 0 ? ((actualPlacedStudents / students.length) * 100).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2 pt-0">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">SmartHire Placement Management System</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-400">Placement Rate</div>
              <div className="text-3xl font-bold text-green-600">
                {actualPlacementPercentage}%
              </div>
            </div>
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <AdvancedStatsCard
        stats={[
          {
            title: 'Total Students',
            value: stats?.totalStudents || 0,
            delta: 12.0,
            lastMonth: Math.floor((stats?.totalStudents || 0) * 0.88),
            positive: true,
            prefix: '',
            suffix: ''
          },
          {
            title: 'Placed Students',
            value: actualPlacedStudents,
            delta: 8.0,
            lastMonth: Math.floor(actualPlacedStudents * 0.92),
            positive: true,
            prefix: '',
            suffix: ''
          },
          {
            title: 'Active Companies',
            value: stats?.activeCompanies || 0,
            delta: 15.0,
            lastMonth: Math.floor((stats?.activeCompanies || 0) * 0.85),
            positive: true,
            prefix: '',
            suffix: ''
          },
          {
            title: 'Average CGPA',
            value: parseFloat(stats?.averageCgpa || 0),
            delta: 2.1,
            lastMonth: parseFloat(stats?.averageCgpa || 0) - 0.17,
            positive: true,
            prefix: '',
            suffix: '',
            format: (v) => v.toFixed(2),
            lastFormat: (v) => v.toFixed(2)
          }
        ]}
      />

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <button 
            onClick={() => navigate('/admin/students')}
            className="bg-white/8 backdrop-blur-sm border border-gray-400/20 shadow-lg shadow-black/25 p-6 rounded-xl hover:bg-white/12 hover:ring-2 hover:ring-blue-500/50 transition-all duration-200 text-left"
          >
            <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white">Manage Students</h4>
            <p className="text-sm text-gray-400 mt-2">
              Add, edit, or remove student records ({stats?.totalStudents || 0} students)
            </p>
          </button>

          <button 
            onClick={() => navigate('/admin/uploads')}
            className="bg-white/8 backdrop-blur-sm border border-gray-400/20 shadow-lg shadow-black/25 p-6 rounded-xl hover:bg-white/12 hover:ring-2 hover:ring-green-500/50 transition-all duration-200 text-left"
          >
            <div className="h-12 w-12 rounded-lg bg-green-600 flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white">Manage Companies</h4>
            <p className="text-sm text-gray-400 mt-2">
              Add placement opportunities ({stats?.activeCompanies || 0} companies)
            </p>
          </button>

          <button 
            onClick={() => navigate('/admin/statistics')}
            className="bg-white/8 backdrop-blur-sm border border-gray-400/20 shadow-lg shadow-black/25 p-6 rounded-xl hover:bg-white/12 hover:ring-2 hover:ring-purple-500/50 transition-all duration-200 text-left"
          >
            <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white">View Statistics</h4>
            <p className="text-sm text-gray-400 mt-2">
              Analyze placement trends ({actualPlacementPercentage}% placed)
            </p>
          </button>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live Updates</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border-l-4 border-green-500">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">New Placement Success!</p>
              <p className="text-gray-400 text-sm">2 students placed in Dream companies this month</p>
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border-l-4 border-blue-500">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Student Registration Spike</p>
              <p className="text-gray-400 text-sm">{students.length} total students now registered</p>
            </div>
            <span className="text-xs text-gray-500">2 days ago</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border-l-4 border-purple-500">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Placement Rate: {actualPlacementPercentage}%</p>
              <p className="text-gray-400 text-sm">Above industry average - Great progress!</p>
            </div>
            <span className="text-xs text-gray-500">Updated now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;