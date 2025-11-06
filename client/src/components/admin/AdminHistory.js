import React, { useState } from 'react';
import { History, Building2, Users, CheckCircle, Calendar, Filter, Search } from 'lucide-react';

const AdminHistory = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [searchTerm, setSearchTerm] = useState('');

  const placementHistory = [
    {
      id: 1,
      companyName: 'Google',
      jobRole: 'Software Engineer',
      package: '45 LPA',
      driveDate: '2024-01-15',
      eligibleStudents: 12,
      registeredStudents: 10,
      selectedStudents: 3,
      type: 'Dream',
      status: 'Completed',
      selectedCandidates: ['Priya Sharma', 'Kavya Iyer', 'Shreya Kapoor']
    },
    {
      id: 2,
      companyName: 'Microsoft',
      jobRole: 'SDE',
      package: '38 LPA',
      driveDate: '2024-01-22',
      eligibleStudents: 15,
      registeredStudents: 12,
      selectedStudents: 2,
      type: 'Dream',
      status: 'Completed',
      selectedCandidates: ['Kritika Bansal', 'Sakshi Goyal']
    },
    {
      id: 3,
      companyName: 'TechCorp',
      jobRole: 'Software Engineer',
      package: '12 LPA',
      driveDate: '2024-02-05',
      eligibleStudents: 28,
      registeredStudents: 25,
      selectedStudents: 8,
      type: 'General',
      status: 'Completed',
      selectedCandidates: ['Ananya Patel', 'Sneha Gupta', 'Meera Krishnan', 'Divya Menon', 'Pooja Agarwal', 'Riya Shah', 'Nisha Pandey', 'Tanvi Jain']
    },
    {
      id: 4,
      companyName: 'InfoSys',
      jobRole: 'System Engineer',
      package: '8 LPA',
      driveDate: '2024-02-12',
      eligibleStudents: 35,
      registeredStudents: 30,
      selectedStudents: 12,
      type: 'General',
      status: 'Completed',
      selectedCandidates: ['Aarti Sharma', 'Swati Mishra', 'Neha Sinha', 'Simran Kaur', 'Gaurav Saxena', 'Ishita Bhatt', 'Ritika Malhotra', 'Preeti Ahluwalia', 'Jyoti Kumari', 'Bhavna Singh', 'Shweta Pandey', 'Aditi Chopra']
    },
    {
      id: 5,
      companyName: 'Amazon',
      jobRole: 'Software Developer',
      package: '22 LPA',
      driveDate: '2023-12-10',
      eligibleStudents: 18,
      registeredStudents: 15,
      selectedStudents: 0,
      type: 'Dream',
      status: 'Completed',
      selectedCandidates: []
    },
    {
      id: 6,
      companyName: 'Wipro',
      jobRole: 'Developer',
      package: '6 LPA',
      driveDate: '2023-11-28',
      eligibleStudents: 40,
      registeredStudents: 35,
      selectedStudents: 0,
      type: 'General',
      status: 'Completed',
      selectedCandidates: []
    },
    {
      id: 7,
      companyName: 'TCS',
      jobRole: 'Assistant System Engineer',
      package: '7 LPA',
      driveDate: '2023-10-15',
      eligibleStudents: 45,
      registeredStudents: 40,
      selectedStudents: 0,
      type: 'General',
      status: 'Completed',
      selectedCandidates: []
    }
  ];

  const filteredHistory = placementHistory.filter(drive => {
    const matchesYear = drive.driveDate.startsWith(selectedYear);
    const matchesSearch = drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.jobRole.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Ongoing': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Dream': return 'bg-purple-100 text-purple-800';
      case 'Super Dream': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const totalStats = {
    totalDrives: filteredHistory.length,
    totalSelected: filteredHistory.reduce((sum, drive) => sum + drive.selectedStudents, 0),
    totalRegistrations: filteredHistory.reduce((sum, drive) => sum + drive.registeredStudents, 0),
    avgSelectionRate: filteredHistory.length > 0 ? 
      Math.round((filteredHistory.reduce((sum, drive) => sum + (drive.selectedStudents / drive.registeredStudents * 100), 0) / filteredHistory.length)) : 0
  };

  return (
    <div className="space-y-8 p-2 pt-0">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Placement History</h1>
            <p className="text-gray-400">Historical data of past placement drives and outcomes</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 p-6 rounded-xl">
          <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-white">Total Drives</h4>
          <p className="text-3xl font-bold text-white mt-2">{totalStats.totalDrives}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 p-6 rounded-xl">
          <div className="h-12 w-12 rounded-lg bg-green-600 flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-white">Students Selected</h4>
          <p className="text-3xl font-bold text-white mt-2">{totalStats.totalSelected}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 p-6 rounded-xl">
          <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-white">Total Registrations</h4>
          <p className="text-3xl font-bold text-white mt-2">{totalStats.totalRegistrations}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 p-6 rounded-xl">
          <div className="h-12 w-12 rounded-lg bg-orange-600 flex items-center justify-center mb-4">
            <History className="h-6 w-6 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-white">Avg Selection Rate</h4>
          <p className="text-3xl font-bold text-white mt-2">{totalStats.avgSelectionRate}%</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company name or job role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 overflow-hidden rounded-xl">
        <div className="px-6 py-6 border-b border-white/20">
          <h3 className="text-xl leading-6 font-semibold text-white">
            Placement Drives History ({selectedYear})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Company Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Drive Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Results
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredHistory.map((drive) => (
                <tr key={drive.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="h-8 w-8 text-purple-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-white">{drive.companyName}</div>
                        <div className="text-sm text-gray-400">{drive.jobRole}</div>
                        <div className="text-sm text-gray-400">Package: {drive.package}</div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mt-1">
                          {drive.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-white">
                        {new Date(drive.driveDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <div>
                      <div>Eligible: {drive.eligibleStudents}</div>
                      <div>Registered: {drive.registeredStudents}</div>
                      <div className="text-xs text-gray-400">
                        Registration Rate: {Math.round((drive.registeredStudents / drive.eligibleStudents) * 100)}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      <div className="font-medium">Selected: {drive.selectedStudents}</div>
                      <div className="text-xs text-gray-400">
                        Selection Rate: {drive.registeredStudents > 0 ? Math.round((drive.selectedStudents / drive.registeredStudents) * 100) : 0}%
                      </div>
                      {drive.selectedStudents > 0 && (
                        <div className="mt-2">
                          <details className="cursor-pointer">
                            <summary className="text-xs text-purple-400 hover:text-purple-300">
                              View Selected Students
                            </summary>
                            <div className="mt-1 text-xs text-gray-300">
                              {drive.selectedCandidates.join(', ')}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                      {drive.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No placement history found</h3>
            <p className="text-gray-400">
              {searchTerm ? 'No drives match your search criteria.' : `No placement drives found for ${selectedYear}.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHistory;