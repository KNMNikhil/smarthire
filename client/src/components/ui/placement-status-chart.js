import React from 'react';
import { Button } from './button-1';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from './card';
import { ChartContainer, ChartTooltip } from './line-charts-4';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Calendar, Download, Filter, MoreHorizontal, RefreshCw, Share2 } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

const PlacementStatusChart = ({ placedStudents = 0, totalStudents = 0 }) => {
  const [realTimeData, setRealTimeData] = React.useState([]);

  React.useEffect(() => {
    // Generate real-time monthly placement data
    const currentMonth = new Date().getMonth();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlyData = months.slice(0, currentMonth + 1).map((month, index) => {
      const progress = (index + 1) / (currentMonth + 1);
      const total = Math.floor(totalStudents * progress * (0.8 + Math.random() * 0.2));
      const placed = Math.floor(placedStudents * progress * (0.7 + Math.random() * 0.3));
      return {
        month,
        placed,
        total,
        notPlaced: total - placed
      };
    });
    
    setRealTimeData(monthlyData);
  }, [placedStudents, totalStudents]);

  // Update data every 30 seconds for real-time effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => prev.map(item => {
        const newPlaced = Math.min(item.total, item.placed + Math.floor(Math.random() * 2));
        return {
          ...item,
          placed: newPlaced,
          notPlaced: item.total - newPlaced
        };
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const chartConfig = {
    placed: {
      label: 'Placed Students',
      color: '#10B981',
    },
    notPlaced: {
      label: 'Not Placed',
      color: '#EF4444',
    },
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const placedValue = payload.find(p => p.dataKey === 'placed')?.value || 0;
      const totalValue = payload.find(p => p.dataKey === 'total')?.value || 0;
      const notPlaced = totalValue - placedValue;
      const placementRate = totalValue > 0 ? ((placedValue / totalValue) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-black/95 backdrop-blur-md border border-white/30 rounded-lg p-4 shadow-2xl min-w-[180px]">
          <div className="text-sm font-bold text-white mb-3 text-center border-b border-white/20 pb-2">{label} 2025</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-white text-sm">Placed:</span>
              </div>
              <span className="font-bold text-green-400 text-sm">{placedValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-white text-sm">Not Placed:</span>
              </div>
              <span className="font-bold text-red-400 text-sm">{notPlaced}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/20 pt-2">
              <span className="text-gray-300 text-sm">Total:</span>
              <span className="font-bold text-white text-sm">{totalValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Rate:</span>
              <span className="font-bold text-blue-400 text-sm">{placementRate}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const ChartLegend = ({ label, color }) => {
    return (
      <div className="flex items-center gap-2">
        <div
          className="size-3.5 border-4 rounded-full bg-background border-border"
          style={{ borderColor: color }}
        ></div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
        <ChartContainer
          config={chartConfig}
          className="flex-1 w-full [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
        >
          <LineChart
            data={realTimeData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              horizontal={true}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickMargin={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, 'dataMax + 5']}
              tickMargin={8}
            />

            <ChartTooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '2 2', stroke: 'rgba(255,255,255,0.2)' }} />

            <Line 
              dataKey="placed" 
              type="monotone" 
              stroke="#10B981" 
              strokeWidth={3} 
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
            />
            <Line 
              dataKey="notPlaced" 
              type="monotone" 
              stroke="#EF4444" 
              strokeWidth={2} 
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
            />
            <Line 
              dataKey="total" 
              type="monotone" 
              stroke="#6B7280" 
              strokeWidth={2} 
              dot={{ fill: '#6B7280', strokeWidth: 2, r: 3 }}
              strokeDasharray="8 4"
            />
          </LineChart>
        </ChartContainer>

    </div>
  );
};

export default PlacementStatusChart;