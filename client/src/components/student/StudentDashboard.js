import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/apiService';
import { Building2, Calendar, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Skeleton from '../ui/Skeleton';

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

  const handleRegister = async (companyId) => {
    try {
      await studentService.registerForCompany(companyId);
      alert('Registration successful!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error registering for company:', error);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 p-2 pt-0">
        {/* Header Skeleton */}
        <div className="bg-white/10 shadow-2xl rounded-xl p-8 h-32 relative overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24" repeat={4} />
        </div>

        {/* Opportunities Skeleton */}
        <div className="bg-white/10 shadow-2xl rounded-xl p-8 space-y-4">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-20 w-full" repeat={3} />
        </div>
      </div>
    );
  }

  const { student, eligibleCompanies, placedCompanies, totalEligible } = dashboardData || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-2 pt-0"
    >
      {/* Header */}
      <div className="bg-white/10 shadow-2xl shadow-black/50 rounded-xl p-8">
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
            <div className="text-right">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white`}>
                {student?.placedStatus === 'Not Placed' ? (
                  <Clock className="w-4 h-4 mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {student?.placedStatus}
              </span>
              {placedCompanies && placedCompanies.length > 0 && (
                <div className="text-xs text-gray-400 mt-1">
                  @ {placedCompanies.map(c => c.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/10 shadow-2xl shadow-black/50 p-6 rounded-xl">
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

        <div className="bg-white/10 shadow-2xl shadow-black/50 p-6 rounded-xl">
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

        <div className="bg-white/10 shadow-2xl shadow-black/50 p-6 rounded-xl">
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

        <div className="bg-white/10 shadow-2xl shadow-black/50 p-6 rounded-xl">
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

      {/* Placed Companies */}
      {placedCompanies && placedCompanies.length > 0 && (
        <div className="bg-white/10 shadow-2xl shadow-black/50 rounded-xl p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">🎉 Congratulations! You're Placed</h3>
            <p className="mt-2 text-gray-400">
              Companies where you have been selected
            </p>
          </div>
          <div className="space-y-4">
            {placedCompanies.map((company) => (
              <div key={company.id} className="bg-green-600/20 border border-green-500/30 shadow-lg shadow-black/25 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-white">{company.name}</div>
                      <div className="text-sm text-gray-300">Selected - {student?.placedStatus}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-300">
                      <div className="text-white font-medium">Package: {company.package}</div>
                      <div>Type: {company.type}</div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                      Selected
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Opportunities */}
      <div className="bg-white/10 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white">
            {placedCompanies && placedCompanies.length > 0 ? 'Other Opportunities' : 'Available Opportunities'}
          </h3>
          <p className="mt-2 text-gray-400">
            {(() => {
              if (placedCompanies && placedCompanies.length > 0) {
                return 'Other placement opportunities you can still apply for';
              }
              switch (student?.placedStatus) {
                case 'Not Placed':
                  return 'All placement opportunities you\'re eligible for';
                case 'Placed - General':
                  return 'Dream and Super Dream opportunities available for you';
                case 'Placed - Dream':
                  return 'General and Super Dream opportunities available for you';
                case 'Placed - Super Dream':
                  return 'General and Dream opportunities available for you';
                case 'Higher Studies':
                  return 'No placement opportunities (Higher Studies selected)';
                default:
                  return 'Placement opportunities you\'re eligible for';
              }
            })()}
          </p>
        </div>
        <div className="space-y-4">
          {eligibleCompanies?.slice(0, 5).map((company) => (
            <div key={company.id} className="bg-white/8 shadow-lg shadow-black/25 p-6 rounded-xl">
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
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white`}>
                      {company.type}
                    </span>
                    <button
                      onClick={() => handleRegister(company.id)}
                      className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full hover:bg-purple-700 transition-colors"
                    >
                      Register
                    </button>
                  </div>
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
    </motion.div>
  );
};

export default StudentDashboard;