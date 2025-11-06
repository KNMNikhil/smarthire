import React, { useState, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { adminService } from '../../services/apiService';
import PlacementStatusChart from '../ui/placement-status-chart';
import { DonutChart } from '../ui/donut-chart';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, Filler);



const AdminStatistics = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredArrears, setHoveredArrears] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [cgpaData, setCgpaData] = useState({
    labels: ['6.0-7.0', '7.0-8.0', '8.0-9.0', '9.0-10.0'],
    datasets: [{
      label: '',
      data: [0, 0, 0, 0],
      backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'],
      borderColor: ['#DC2626', '#D97706', '#059669', '#2563EB'],
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  });

  useEffect(() => {
    fetchData();
    
    // Set up real-time polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      const cgpaRanges = [
        { min: 6.0, max: 7.0 },
        { min: 7.0, max: 8.0 },
        { min: 8.0, max: 9.0 },
        { min: 9.0, max: 10.0 }
      ];
      
      const cgpaDistribution = cgpaRanges.map((range, index) => {
        return students.filter(s => {
          const cgpa = parseFloat(s.cgpa);
          if (isNaN(cgpa)) return false;
          
          // For the last range (9.0-10.0), include 10.0
          if (index === cgpaRanges.length - 1) {
            return cgpa >= range.min && cgpa <= range.max;
          }
          return cgpa >= range.min && cgpa < range.max;
        }).length;
      });
      
      setCgpaData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: cgpaDistribution
        }]
      }));
    }
  }, [students]);



  const fetchData = useCallback(async () => {
    try {
      const [statsResponse, studentsResponse, companiesResponse] = await Promise.all([
        adminService.getDashboard(),
        adminService.getStudents(),
        adminService.getCompanies()
      ]);
      
      setStats(statsResponse.data);
      setStudents(studentsResponse.data || []);
      setCompanies(companiesResponse.data || []);
      
      // Calculate real-time registration data from actual database
      const currentDate = new Date();
      const monthlyData = [];
      const studentsData = studentsResponse.data || [];
      const companiesData = companiesResponse.data || [];
      
      for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = month.toLocaleDateString('en-US', { month: 'short' });
        
        // Filter students registered in this month
        const monthRegistrations = studentsData.filter(student => {
          if (!student.createdAt) return false;
          const regDate = new Date(student.createdAt);
          return regDate.getMonth() === month.getMonth() && regDate.getFullYear() === month.getFullYear();
        }).length;
        
        // Filter companies added in this month
        const monthCompanies = companiesData.filter(company => {
          if (!company.createdAt) return false;
          const compDate = new Date(company.createdAt);
          return compDate.getMonth() === month.getMonth() && compDate.getFullYear() === month.getFullYear();
        }).length;
        
        monthlyData.push({
          month: monthName,
          registrations: monthRegistrations,
          companies: monthCompanies
        });
      }
      
      setRegistrations(monthlyData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading Statistics..." />
      </div>
    );
  }

  // Calculate placed students from actual data
  const actualPlacedStudents = students.filter(s => 
    ['Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(s.placedStatus)
  ).length;
  
  // Placement Status Chart Data
  const placementData = {
    labels: ['Placed', 'Not Placed'],
    datasets: [{
      data: [actualPlacedStudents, students.length - actualPlacedStudents],
      backgroundColor: ['#10B981', '#EF4444'],
      borderWidth: 2
    }]
  };

  // Arrears Chart Data for Donut Chart
  const arrearsDonutData = [
    { 
      value: students.filter(s => {
        const arrears = parseInt(s.arrears) || 0;
        return arrears === 0;
      }).length, 
      color: '#10B981', 
      label: '0 Arrears' 
    },
    { 
      value: students.filter(s => {
        const arrears = parseInt(s.arrears) || 0;
        return arrears >= 1 && arrears <= 2;
      }).length, 
      color: '#F59E0B', 
      label: '1-2 Arrears' 
    },
    { 
      value: students.filter(s => {
        const arrears = parseInt(s.arrears) || 0;
        return arrears >= 3;
      }).length, 
      color: '#EF4444', 
      label: '3+ Arrears' 
    }
  ];
  

  
  const totalArrearsValue = arrearsDonutData.reduce((sum, d) => sum + d.value, 0);
  const activeArrearsSegment = arrearsDonutData.find(segment => segment.label === hoveredArrears);
  const displayArrearsValue = activeArrearsSegment?.value ?? totalArrearsValue;
  const displayArrearsLabel = activeArrearsSegment?.label ?? 'Total Students';
  const displayArrearsPercentage = activeArrearsSegment ? (activeArrearsSegment.value / totalArrearsValue) * 100 : 100;

  // Real-time Monthly Registration Activity
  const registrationData = {
    labels: registrations.map(r => r.month),
    datasets: [{
      label: 'Student Registrations',
      data: registrations.map(r => r.registrations),
      borderColor: '#06B6D4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#06B6D4',
      pointBorderColor: '#06B6D4',
      pointBorderWidth: 0,
      pointRadius: 4
    }, {
      label: 'Company Additions',
      data: registrations.map(r => r.companies),
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      tension: 0.4,
      fill: false,
      pointBackgroundColor: '#F59E0B',
      pointBorderColor: '#F59E0B',
      pointBorderWidth: 0,
      pointRadius: 4
    }]
  };

  const registrationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'bottom',
        labels: {
          color: '#9CA3AF',
          font: { size: 11 },
          padding: 15,
          usePointStyle: true
        }
      },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#9CA3AF',
          font: { size: 11 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9CA3AF',
          font: { size: 11 }
        }
      }
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    }
  };

  return (
    <div className="space-y-8 p-6 overflow-x-hidden">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Placement Statistics & Analytics</h2>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats?.totalStudents || 0}</div>
            <div className="text-sm text-gray-400">Total Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{actualPlacedStudents}</div>
            <div className="text-sm text-gray-400">Placed Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{students.length > 0 ? ((actualPlacedStudents / students.length) * 100).toFixed(2) : 0}%</div>
            <div className="text-sm text-gray-400">Placement Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{stats?.averageCgpa || '0.00'}</div>
            <div className="text-sm text-gray-400">Average CGPA</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Placement Status Line Chart */}
          <div className="bg-white/8 backdrop-blur-sm border border-gray-400/20 shadow-lg shadow-black/25 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Placement Status Distribution</h3>
            <div className="h-64 overflow-hidden">
              <PlacementStatusChart 
                placedStudents={actualPlacedStudents} 
                totalStudents={students.length} 
              />
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-300">Placed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-300">Not Placed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-300">Higher Studies</span>
              </div>
            </div>
          </div>

          {/* CGPA Distribution Bar Chart */}
          <div className="bg-white/8 backdrop-blur-sm border border-gray-400/20 shadow-lg shadow-black/25 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">CGPA Distribution</h3>
            <div className="h-64 overflow-hidden">
              <Bar 
                data={cgpaData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    },
                    title: { 
                      display: false 
                    },
                    ...chartOptions.plugins,
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.95)',
                      titleColor: '#ffffff',
                      bodyColor: '#e5e7eb',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      borderWidth: 1,
                      cornerRadius: 12,
                      displayColors: false,
                      padding: 12,
                      titleFont: { size: 13, weight: 'bold' },
                      bodyFont: { size: 12 },
                      titleAlign: 'center',
                      bodyAlign: 'left',
                      callbacks: {
                        title: (context) => `CGPA Range: ${context[0].label}`,
                        label: (context) => `Students: ${context.parsed.y}`,
                        afterLabel: (context) => {
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                          return `Percentage: ${percentage}%`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                      },
                      ticks: {
                        color: '#9CA3AF',
                        font: { size: 11 }
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: '#9CA3AF',
                        font: { size: 11 }
                      }
                    }
                  }
                }} 
              />
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className="text-xs text-gray-300">7.0-8.0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-xs text-gray-300">8.0-9.0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-xs text-gray-300">9.0-10.0</span>
              </div>
            </div>
          </div>

          {/* Arrears Distribution */}
          <div className="bg-white/8 backdrop-blur-sm border border-gray-400/20 shadow-lg shadow-black/25 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Students by Arrears</h3>
            <div className="h-64 overflow-hidden flex items-center justify-center">
              <DonutChart
                data={arrearsDonutData}
                size={200}
                strokeWidth={25}
                animationDuration={1.2}
                animationDelayPerSegment={0.1}
                highlightOnHover={true}
                onSegmentHover={(segment) => setHoveredArrears(segment?.label || null)}
                centerContent={
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={displayArrearsLabel}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "circOut" }}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      <p className="text-gray-300 text-xs font-medium truncate max-w-[120px]">
                        {displayArrearsLabel}
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {displayArrearsValue}
                      </p>
                      {activeArrearsSegment && (
                        <p className="text-sm font-medium text-gray-400">
                          [{displayArrearsPercentage.toFixed(0)}%]
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                }
              />
            </div>
            <div className="flex flex-col space-y-2 mt-4 pt-3 border-t border-white/10">
              {arrearsDonutData.map((segment, index) => (
                <motion.div
                  key={segment.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  className={`flex items-center justify-between p-2 rounded-md transition-all duration-200 cursor-pointer ${
                    hoveredArrears === segment.label ? 'bg-white/5' : ''
                  }`}
                  onMouseEnter={() => setHoveredArrears(segment.label)}
                  onMouseLeave={() => setHoveredArrears(null)}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    ></span>
                    <span className="text-sm font-medium text-gray-300">
                      {segment.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-400">
                    {segment.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Real-time Monthly Activity */}
          <div className="bg-white/8 backdrop-blur-sm border border-gray-400/20 shadow-lg shadow-black/25 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Live Activity Overview</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Live Data</span>
              </div>
            </div>
            <div className="h-72 flex items-start justify-center pt-16">
              <div className="w-full h-64">
                <Line data={registrationData} options={registrationChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;