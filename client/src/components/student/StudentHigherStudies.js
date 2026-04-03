import React, { useState, useEffect } from 'react';
import { GraduationCap, FileText, Send, CheckCircle, Clock, XCircle, Download, Eye, Plus } from 'lucide-react';

const StudentHigherStudies = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    university: '',
    program: '',
    degree: '',
    country: '',
    applicationDeadline: '',
    requiredDocuments: [],
    personalStatement: '',
    additionalInfo: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockApplications = [
        {
          id: 1,
          university: 'Stanford University',
          program: 'Master of Science in Computer Science',
          degree: 'MS',
          country: 'USA',
          applicationDeadline: '2024-12-15',
          status: 'approved',
          submittedDate: '2024-01-10',
          reviewedDate: '2024-01-15',
          adminComments: 'LOR and SOP approved. Documents are ready for submission.',
          documents: {
            lor: { status: 'approved', fileName: 'stanford_lor.pdf' },
            sop: { status: 'approved', fileName: 'stanford_sop.pdf' },
            transcripts: { status: 'approved', fileName: 'transcripts.pdf' }
          }
        },
        {
          id: 2,
          university: 'MIT',
          program: 'Master of Engineering in Artificial Intelligence',
          degree: 'MEng',
          country: 'USA',
          applicationDeadline: '2024-11-30',
          status: 'pending',
          submittedDate: '2024-01-20',
          reviewedDate: null,
          adminComments: null,
          documents: {
            lor: { status: 'pending', fileName: 'mit_lor_draft.pdf' },
            sop: { status: 'pending', fileName: 'mit_sop_draft.pdf' },
            transcripts: { status: 'approved', fileName: 'transcripts.pdf' }
          }
        },
        {
          id: 3,
          university: 'University of Cambridge',
          program: 'MPhil in Advanced Computer Science',
          degree: 'MPhil',
          country: 'UK',
          applicationDeadline: '2024-10-15',
          status: 'revision_required',
          submittedDate: '2024-01-05',
          reviewedDate: '2024-01-12',
          adminComments: 'SOP needs revision. Please emphasize research interests more clearly.',
          documents: {
            lor: { status: 'approved', fileName: 'cambridge_lor.pdf' },
            sop: { status: 'revision_required', fileName: 'cambridge_sop_v1.pdf' },
            transcripts: { status: 'approved', fileName: 'transcripts.pdf' }
          }
        }
      ];

      setApplications(mockApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      // Mock submission - replace with actual API call
      const newApplication = {
        id: applications.length + 1,
        ...applicationData,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0],
        reviewedDate: null,
        adminComments: null,
        documents: {
          lor: { status: 'pending', fileName: 'lor_draft.pdf' },
          sop: { status: 'pending', fileName: 'sop_draft.pdf' },
          transcripts: { status: 'pending', fileName: 'transcripts.pdf' }
        }
      };

      setApplications([newApplication, ...applications]);
      setShowApplicationModal(false);
      setApplicationData({
        university: '',
        program: '',
        degree: '',
        country: '',
        applicationDeadline: '',
        requiredDocuments: [],
        personalStatement: '',
        additionalInfo: ''
      });
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'revision_required':
        return <XCircle className="h-5 w-5 text-yellow-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/30 text-green-400 border-green-400/30';
      case 'revision_required':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-400/30';
      case 'pending':
        return 'bg-blue-900/30 text-blue-400 border-blue-400/30';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-400/30';
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-400';
      case 'revision_required':
        return 'text-yellow-400';
      case 'pending':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 shadow-2xl rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-purple-400" />
              Higher Studies Applications
            </h1>
            <p className="text-gray-400 mt-2">Apply for LOR and SOP for your higher studies applications</p>
          </div>
          <button
            onClick={() => setShowApplicationModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Application
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">{applications.length}</div>
              <div className="text-sm text-gray-400">Total Applications</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-white">{applications.filter(a => a.status === 'approved').length}</div>
              <div className="text-sm text-gray-400">Approved</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">{applications.filter(a => a.status === 'pending').length}</div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-white">{applications.filter(a => a.status === 'revision_required').length}</div>
              <div className="text-sm text-gray-400">Need Revision</div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white/10 shadow-2xl rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Your Applications</h2>
        
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Applications Yet</h3>
            <p className="text-gray-400 mb-4">Start your higher studies journey by applying for LOR and SOP</p>
            <button
              onClick={() => setShowApplicationModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Submit Your First Application
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{app.university}</h3>
                        <p className="text-gray-400">{app.program}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <div className="text-gray-400">Degree</div>
                        <div className="text-white font-medium">{app.degree}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Country</div>
                        <div className="text-white font-medium">{app.country}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Deadline</div>
                        <div className="text-white font-medium">{new Date(app.applicationDeadline).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Submitted</div>
                        <div className="text-white font-medium">{new Date(app.submittedDate).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Document Status */}
                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                      <h4 className="text-white font-medium mb-3">Document Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Letter of Recommendation</span>
                          <span className={`text-sm font-medium ${getDocumentStatusColor(app.documents.lor.status)}`}>
                            {app.documents.lor.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Statement of Purpose</span>
                          <span className={`text-sm font-medium ${getDocumentStatusColor(app.documents.sop.status)}`}>
                            {app.documents.sop.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Transcripts</span>
                          <span className={`text-sm font-medium ${getDocumentStatusColor(app.documents.transcripts.status)}`}>
                            {app.documents.transcripts.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {app.adminComments && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-sm mb-1">Admin Comments:</div>
                        <div className="text-white text-sm">{app.adminComments}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    {app.status === 'approved' && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Documents
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-black/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">New Higher Studies Application</h2>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitApplication} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">University *</label>
                  <input
                    type="text"
                    required
                    value={applicationData.university}
                    onChange={(e) => setApplicationData({...applicationData, university: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Enter university name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Country *</label>
                  <select
                    required
                    value={applicationData.country}
                    onChange={(e) => setApplicationData({...applicationData, country: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    <option value="">Select Country</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Degree *</label>
                  <select
                    required
                    value={applicationData.degree}
                    onChange={(e) => setApplicationData({...applicationData, degree: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    <option value="">Select Degree</option>
                    <option value="MS">Master of Science (MS)</option>
                    <option value="MEng">Master of Engineering (MEng)</option>
                    <option value="MBA">Master of Business Administration (MBA)</option>
                    <option value="MPhil">Master of Philosophy (MPhil)</option>
                    <option value="PhD">Doctor of Philosophy (PhD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Application Deadline *</label>
                  <input
                    type="date"
                    required
                    value={applicationData.applicationDeadline}
                    onChange={(e) => setApplicationData({...applicationData, applicationDeadline: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Program *</label>
                <input
                  type="text"
                  required
                  value={applicationData.program}
                  onChange={(e) => setApplicationData({...applicationData, program: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="e.g., Master of Science in Computer Science"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Personal Statement / Research Interests *</label>
                <textarea
                  required
                  value={applicationData.personalStatement}
                  onChange={(e) => setApplicationData({...applicationData, personalStatement: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Describe your research interests, career goals, and why you want to pursue this program"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Additional Information</label>
                <textarea
                  value={applicationData.additionalInfo}
                  onChange={(e) => setApplicationData({...applicationData, additionalInfo: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Any additional information you'd like to include"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-3 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHigherStudies;