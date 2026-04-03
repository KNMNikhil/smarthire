import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/apiService';
import { Building2, Calendar, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react';

const StudentRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await studentService.getRegisteredCompanies();
      setRegistrations(response.data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="bg-white/10 shadow-2xl shadow-black/50 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Registrations</h1>
        <p className="text-gray-400">Companies you have registered for placement drives</p>
      </div>

      {registrations.length > 0 ? (
        <div className="grid gap-6">
          {registrations.map((company) => (
            <div key={company.id} className="bg-white/10 shadow-2xl shadow-black/50 rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-green-600 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white">{company.name}</h3>
                      <p className="text-sm text-gray-300 mb-4">{company.jobRole || 'Placement Drive'}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-400 mr-2" />
                          <span className="font-medium text-gray-400">Package:</span>
                          <span className="ml-2 text-white">{company.package || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-red-400 mr-2" />
                          <span className="font-medium text-gray-400">Location:</span>
                          <span className="ml-2 text-white">{company.location || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-400 mr-2" />
                          <span className="font-medium text-gray-400">Drive Date:</span>
                          <span className="ml-2 text-white">
                            {company.visitDate ? new Date(company.visitDate).toLocaleDateString() : 'TBA'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-yellow-400 mr-2" />
                          <span className="font-medium text-gray-400">Type:</span>
                          <span className="ml-2 text-white">{company.type || 'General'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.type === 'Super Dream' ? 'bg-purple-600/80' :
                      company.type === 'Dream' ? 'bg-blue-600/80' : 'bg-green-600/80'
                    } backdrop-blur-sm text-white`}>
                      {company.type || 'General'}
                    </span>
                    
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-600/80 backdrop-blur-sm text-white">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Registered
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/10 shadow-2xl shadow-black/50 rounded-xl p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Registrations Yet</h3>
          <p className="text-gray-400">
            You haven't registered for any companies yet. Visit the Inbox to see available opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentRegistrations;