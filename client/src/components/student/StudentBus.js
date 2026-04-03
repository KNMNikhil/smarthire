import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Clock, Users, Calendar, Navigation } from 'lucide-react';

const StudentBus = () => {
  const [busRoutes, setBusRoutes] = useState([]);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusData();
  }, []);

  const fetchBusData = async () => {
    try {
      // For now, get all bus routes and filter by mock eligibility
      // In production, this should call the actual API
      const mockEligibleRoutes = JSON.parse(localStorage.getItem('busRoutes') || '[]');
      
      // Mock student eligibility - replace with actual API call
      const studentEligibleCompanies = ['Amazon', 'Google', 'Microsoft', 'TCS', 'Infosys'];
      
      const eligibleRoutes = mockEligibleRoutes.filter(route => 
        studentEligibleCompanies.includes(route.company)
      );
      
      setBusRoutes(eligibleRoutes);
      setUpcomingDrives(eligibleRoutes.filter(route => new Date(route.date) >= new Date()));
    } catch (error) {
      console.error('Error fetching bus data:', error);
    } finally {
      setLoading(false);
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
              <Bus className="h-8 w-8 text-purple-400" />
              Bus Facility
            </h1>
            <p className="text-gray-400 mt-2">Transportation for off-campus placement drives</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">{upcomingDrives.length}</div>
            <div className="text-sm text-gray-400">Upcoming Trips</div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-8 w-8 text-blue-400" />
            <div>
              <div className="text-white font-semibold">Boarding Point</div>
              <div className="text-gray-400 text-sm">College Main Gate</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-green-400" />
            <div>
              <div className="text-white font-semibold">Reporting Time</div>
              <div className="text-gray-400 text-sm">30 mins before departure</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Navigation className="h-8 w-8 text-orange-400" />
            <div>
              <div className="text-white font-semibold">Contact</div>
              <div className="text-gray-400 text-sm">Transport Office: 044-12345678</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bus Routes */}
      <div className="bg-white/10 shadow-2xl rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-purple-400" />
          Upcoming Bus Routes
        </h2>
        
        {upcomingDrives.length === 0 ? (
          <div className="text-center py-12">
            <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Upcoming Bus Routes</h3>
            <p className="text-gray-400">Bus schedules will appear here when placement drives are scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingDrives.length > 0 ? upcomingDrives.map((route) => (
              <div key={route.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Bus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{route.company}</h3>
                        <p className="text-gray-400 text-sm">Bus: {route.busNumber}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Date & Time</div>
                        <div className="text-white font-medium">{new Date(route.date).toLocaleDateString()}</div>
                        <div className="text-purple-400">{route.time} {route.timeAmPm}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Route</div>
                        <div className="text-white font-medium">{route.boardingPoint}</div>
                        <div className="text-gray-400">To: {route.destination}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Travel Time</div>
                        <div className="text-white font-medium">{route.estimatedTravel}</div>
                        <div className="text-gray-400">Return: {route.returnTime} {route.returnTimeAmPm}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Capacity</div>
                        <div className="text-white font-medium">{route.registered}/{route.capacity}</div>
                        <div className={`text-sm ${route.registered < route.capacity ? 'text-green-400' : 'text-red-400'}`}>
                          {route.registered < route.capacity ? 'Seats Available' : 'Full'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="text-right text-sm text-gray-400">
                      Contact: {route.contactPerson}
                    </div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Confirm Seat
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No bus routes available for your eligible companies</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guidelines */}
      <div className="bg-white/10 shadow-2xl rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Bus Travel Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">Before Travel</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                Report 30 minutes before departure time
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                Carry valid college ID and placement confirmation
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                Bring necessary documents and resume copies
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                Wear formal attire as per company requirements
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">During Travel</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                Maintain discipline and represent college positively
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                Follow safety instructions from bus coordinator
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                Keep mobile phones charged for communication
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                Return to bus at designated time after interview
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBus;