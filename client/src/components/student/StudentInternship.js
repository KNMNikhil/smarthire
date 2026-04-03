import React, { useState, useEffect } from 'react';
import { Award, Upload, CheckCircle, XCircle, Clock, FileText, Download, Eye } from 'lucide-react';

const StudentInternship = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    companyName: '',
    duration: '',
    startDate: '',
    endDate: '',
    role: '',
    description: '',
    certificate: null
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockCertificates = [
        {
          id: 1,
          companyName: 'Google India',
          role: 'Software Development Intern',
          duration: '3 months',
          startDate: '2023-06-01',
          endDate: '2023-08-31',
          status: 'approved',
          submittedDate: '2023-09-05',
          reviewedDate: '2023-09-10',
          adminComments: 'Certificate verified and approved for credit transfer.',
          credits: 4,
          fileName: 'google_internship_certificate.pdf'
        },
        {
          id: 2,
          companyName: 'Microsoft Corporation',
          role: 'Data Science Intern',
          duration: '2 months',
          startDate: '2023-12-01',
          endDate: '2024-01-31',
          status: 'pending',
          submittedDate: '2024-02-05',
          reviewedDate: null,
          adminComments: null,
          credits: null,
          fileName: 'microsoft_internship_certificate.pdf'
        },
        {
          id: 3,
          companyName: 'Amazon Web Services',
          role: 'Cloud Computing Intern',
          duration: '4 months',
          startDate: '2023-03-01',
          endDate: '2023-06-30',
          status: 'rejected',
          submittedDate: '2023-07-10',
          reviewedDate: '2023-07-15',
          adminComments: 'Certificate format does not meet university standards. Please resubmit with official letterhead.',
          credits: null,
          fileName: 'aws_internship_certificate.pdf'
        }
      ];

      setCertificates(mockCertificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      // Mock upload - replace with actual API call
      const newCertificate = {
        id: certificates.length + 1,
        ...uploadData,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0],
        reviewedDate: null,
        adminComments: null,
        credits: null,
        fileName: uploadData.certificate?.name || 'certificate.pdf'
      };

      setCertificates([newCertificate, ...certificates]);
      setShowUploadModal(false);
      setUploadData({
        companyName: '',
        duration: '',
        startDate: '',
        endDate: '',
        role: '',
        description: '',
        certificate: null
      });
      alert('Certificate uploaded successfully!');
    } catch (error) {
      console.error('Error uploading certificate:', error);
      alert('Failed to upload certificate');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/30 text-green-400 border-green-400/30';
      case 'rejected':
        return 'bg-red-900/30 text-red-400 border-red-400/30';
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-400/30';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-400/30';
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
              <Award className="h-8 w-8 text-purple-400" />
              Internship Certificate Validation
            </h1>
            <p className="text-gray-400 mt-2">Upload and track your internship certificates for credit transfer</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Certificate
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-white">{certificates.filter(c => c.status === 'approved').length}</div>
              <div className="text-sm text-gray-400">Approved</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-white">{certificates.filter(c => c.status === 'pending').length}</div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-400" />
            <div>
              <div className="text-2xl font-bold text-white">{certificates.filter(c => c.status === 'rejected').length}</div>
              <div className="text-sm text-gray-400">Rejected</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">{certificates.filter(c => c.status === 'approved').reduce((sum, c) => sum + (c.credits || 0), 0)}</div>
              <div className="text-sm text-gray-400">Total Credits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates List */}
      <div className="bg-white/10 shadow-2xl rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Your Certificates</h2>
        
        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Certificates Uploaded</h3>
            <p className="text-gray-400 mb-4">Upload your internship certificates to get them validated for credit transfer</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Upload Your First Certificate
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{cert.companyName}</h3>
                        <p className="text-gray-400">{cert.role}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(cert.status)}`}>
                        {getStatusIcon(cert.status)}
                        <span className="ml-1 capitalize">{cert.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <div className="text-gray-400">Duration</div>
                        <div className="text-white font-medium">{cert.duration}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Period</div>
                        <div className="text-white font-medium">
                          {new Date(cert.startDate).toLocaleDateString()} - {new Date(cert.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Submitted</div>
                        <div className="text-white font-medium">{new Date(cert.submittedDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Credits</div>
                        <div className="text-white font-medium">{cert.credits || 'TBD'}</div>
                      </div>
                    </div>

                    {cert.adminComments && (
                      <div className="bg-white/5 rounded-lg p-3 mb-4">
                        <div className="text-gray-400 text-sm mb-1">Admin Comments:</div>
                        <div className="text-white text-sm">{cert.adminComments}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-black/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">Upload Internship Certificate</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={uploadData.companyName}
                    onChange={(e) => setUploadData({...uploadData, companyName: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Role *</label>
                  <input
                    type="text"
                    required
                    value={uploadData.role}
                    onChange={(e) => setUploadData({...uploadData, role: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Enter your role"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={uploadData.startDate}
                    onChange={(e) => setUploadData({...uploadData, startDate: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={uploadData.endDate}
                    onChange={(e) => setUploadData({...uploadData, endDate: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Duration *</label>
                <input
                  type="text"
                  required
                  value={uploadData.duration}
                  onChange={(e) => setUploadData({...uploadData, duration: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="e.g., 3 months, 12 weeks"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Description</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Brief description of your internship work"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Certificate File *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadData({...uploadData, certificate: e.target.files[0]})}
                  className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-3 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Upload Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInternship;