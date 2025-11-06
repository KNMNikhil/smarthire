import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/apiService';
import { Building2, Calendar, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await studentService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading Dashboard..." />
      </div>
    );
  }

  const { student, eligibleCompanies, totalEligible } = dashboardData || {};

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Placed': return 'text-gray-600 bg-gray-100';
      case 'General': return 'text-green-600 bg-green-100';
      case 'Dream': return 'text-blue-600 bg-blue-100';
      case 'Super Dream': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8 p-2 pt-0">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center h-full">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-purple-400">
                <img 
                  src={student?.rollNo === '220701120' ? '/120.jpg' : student?.rollNo === '220701114' ? '/114.jpg' : student?.rollNo === '220701102' ? 'https://randomuser.me/api/portraits/women/25.jpg' : student?.rollNo === '220701128' ? 'https://randomuser.me/api/portraits/men/52.jpg' : 'https://randomuser.me/api/portraits/women/68.jpg'} 
                  alt="Student Avatar" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1 flex flex-col justify-center -mt-6">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate mb-1">Welcome back</dt>
                <dd className="text-3xl font-bold text-white whitespace-nowrap">{student?.name}</dd>
                <dd className="text-sm text-gray-400 whitespace-nowrap mt-1">Roll No: {student?.rollNo}</dd>
              </dl>
            </div>
          </div>
          <div className="ml-5 flex-shrink-0">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white`}>
              {student?.placedStatus === 'Not Placed' ? (
                <Clock className="w-4 h-4 mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {student?.placedStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">CGPA</dt>
                <dd className="text-2xl font-bold text-white">{student?.cgpa || 'N/A'}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Eligible Companies</dt>
                <dd className="text-2xl font-bold text-white">{totalEligible || 0}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-green-600 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Upcoming Drives</dt>
                <dd className="text-2xl font-bold text-white">
                  {eligibleCompanies?.filter(c => new Date(c.visitDate) > new Date()).length || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-orange-600 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Placement Status</dt>
                <dd className="text-2xl font-bold text-white">
                  {student?.placedStatus !== 'Not Placed' ? 'Placed' : 'Active'}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Opportunities */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white">Recent Opportunities</h3>
          <p className="mt-2 text-gray-400">
            Latest placement opportunities you're eligible for
          </p>
        </div>
        <div className="space-y-4">
          {eligibleCompanies?.slice(0, 5).map((company) => (
            <div key={company.id} className="bg-white/8 backdrop-blur-sm border border-gray-400/20 shadow-lg shadow-black/25 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-semibold text-white">{company.name}</div>
                    <div className="text-sm text-gray-400">{company.jobRole}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">
                    <div className="text-white font-medium">Package: {company.package}</div>
                    <div>Visit: {new Date(company.visitDate).toLocaleDateString()}</div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white`}>
                    {company.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {(!eligibleCompanies || eligibleCompanies.length === 0) && (
            <div className="px-4 py-8 text-center text-gray-400">
              No eligible opportunities at the moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;