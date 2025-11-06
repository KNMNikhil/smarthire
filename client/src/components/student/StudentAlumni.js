import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/apiService';
import { Users, Linkedin, Mail, ExternalLink } from 'lucide-react';

const StudentAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await studentService.getAlumni();
      setAlumni(response.data);
    } catch (error) {
      console.error('Error fetching alumni:', error);
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
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Alumni Network</h1>
          <p className="text-gray-400">Connect with successful alumni from your college</p>
        </div>
      </div>

      {alumni.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((alum) => (
            <div key={alum.id} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-6">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">
                    {alum.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-white">{alum.name}</h3>
                <p className="text-sm text-gray-400">{alum.position}</p>
                <p className="text-sm font-medium text-purple-400">{alum.company}</p>
                <p className="text-xs text-gray-400 mt-1">Batch: {alum.batch}</p>
              </div>
              
              {alum.achievements && (
                <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                  <p className="text-sm text-gray-300">{alum.achievements}</p>
                </div>
              )}

              <div className="mt-4 flex justify-center space-x-3">
                {alum.linkedin && (
                  <a
                    href={alum.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {alum.email && (
                  <a
                    href={`mailto:${alum.email}`}
                    className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Alumni Profiles</h3>
          <p className="text-gray-400">Alumni profiles will be added by the admin.</p>
        </div>
      )}
    </div>
  );
};

export default StudentAlumni;