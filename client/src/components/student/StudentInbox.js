import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/apiService';
import { Building2, Calendar, Clock, CheckCircle, ExternalLink } from 'lucide-react';

const StudentInbox = () => {
  const [inboxData, setInboxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);

  useEffect(() => {
    fetchInboxData();
  }, []);

  const fetchInboxData = async () => {
    try {
      const response = await studentService.getInbox();
      setInboxData(response.data);
    } catch (error) {
      console.error('Error fetching inbox data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (companyId) => {
    setRegistering(companyId);
    try {
      await studentService.registerForCompany(companyId);
      await fetchInboxData(); // Refresh data
    } catch (error) {
      console.error('Error registering for company:', error);
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(null);
    }
  };

  const isRegistrationOpen = (deadline) => {
    return new Date(deadline) > new Date();
  };

  const getRegistrationStatus = (companyId, registrations) => {
    const registration = registrations.find(r => r.companyId === companyId);
    return registration?.status || 'Not Registered';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { eligibleCompanies, registrations } = inboxData || {};

  return (
    <div className="space-y-8 p-2 pt-0">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Placement Opportunities</h1>
        <p className="text-gray-400">Companies you're eligible for based on your academic profile</p>
      </div>

      {eligibleCompanies && eligibleCompanies.length > 0 ? (
        <div className="grid gap-6">
          {eligibleCompanies.map((company) => {
            const registrationStatus = getRegistrationStatus(company.id, registrations);
            const isOpen = isRegistrationOpen(company.registrationDeadline);
            
            return (
              <div key={company.id} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-white">{company.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">{company.jobRole}</p>
                        <p className="text-sm text-gray-300 mb-4">{company.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-400">Package:</span>
                            <span className="ml-2 text-white">{company.package}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Location:</span>
                            <span className="ml-2 text-white">{company.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="font-medium text-gray-400">Visit Date:</span>
                            <span className="ml-2 text-white">
                              {new Date(company.visitDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="font-medium text-gray-400">Registration Deadline:</span>
                            <span className="ml-2 text-white">
                              {new Date(company.registrationDeadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Eligibility Criteria */}
                        <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                          <h4 className="text-sm font-medium text-white mb-2">Eligibility Criteria</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                            <div>Min CGPA: {company.eligibilityCriteria.minCgpa}</div>
                            <div>Max Arrears: {company.eligibilityCriteria.maxArrears}</div>
                            <div>Min 10th %: {company.eligibilityCriteria.minTenthPercentage}</div>
                            <div>Min 12th %: {company.eligibilityCriteria.minTwelfthPercentage}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                        {company.type}
                      </span>
                      
                      {registrationStatus === 'Registered' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-600/80 backdrop-blur-sm text-white">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Registered
                        </span>
                      ) : isOpen ? (
                        <button
                          onClick={() => handleRegister(company.id)}
                          disabled={registering === company.id}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600/80 backdrop-blur-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200"
                        >
                          {registering === company.id ? (
                            'Registering...'
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Register Now
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-600/80 backdrop-blur-sm text-white">
                          Registration Closed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Opportunities Available</h3>
          <p className="text-gray-400">
            There are currently no placement opportunities that match your eligibility criteria.
            Check back later for new opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentInbox;