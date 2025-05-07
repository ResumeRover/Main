import { useState, useEffect } from 'react';
import { getAnalyticsData } from '../../services/api';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  // Mock data for demonstration
  const mockData = {
    summary: {
      totalApplications: 187,
      processedApplications: 154,
      verifiedApplications: 89,
      pendingVerification: 65,
      avgProcessingTime: '1.8 hours'
    },
    applicationTrend: [
      { date: 'Dec 17', count: 12 },
      { date: 'Dec 18', count: 15 },
      { date: 'Dec 19', count: 18 },
      { date: 'Dec 20', count: 22 },
      { date: 'Dec 21', count: 17 },
      { date: 'Dec 22', count: 14 },
      { date: 'Dec 23', count: 16 }
    ],
    verificationStats: {
      valid: 58,
      invalid: 22,
      pending: 65,
      inProgress: 9,
      validatedPercent: 37.6,
      rejectedPercent: 14.3
    },
    skillDistribution: [
      { name: 'Python', count: 42 },
      { name: 'JavaScript', count: 38 },
      { name: 'Java', count: 29 },
      { name: 'React', count: 27 },
      { name: 'SQL', count: 25 },
      { name: 'Node.js', count: 20 },
      { name: 'C#', count: 18 },
      { name: 'AWS', count: 15 }
    ],
    universityDistribution: [
      { name: 'University of Moratuwa', count: 35 },
      { name: 'University of Colombo', count: 28 },
      { name: 'SLIIT', count: 22 },
      { name: 'NSBM', count: 18 },
      { name: 'IIT', count: 15 },
      { name: 'University of Peradeniya', count: 14 },
      { name: 'Other', count: 55 }
    ],
    processingTimeHistory: [
      { date: 'Dec 17', time: 2.1 },
      { date: 'Dec 18', time: 1.9 },
      { date: 'Dec 19', time: 2.0 },
      { date: 'Dec 20', time: 1.7 },
      { date: 'Dec 21', time: 1.8 },
      { date: 'Dec 22', time: 1.6 },
      { date: 'Dec 23', time: 1.8 }
    ],
    recentActivity: [
      { id: 1, time: '10:45 AM', action: 'Verification completed', user: 'Queen Pluml', status: 'Valid' },
      { id: 2, time: '10:30 AM', action: 'Document uploaded', user: 'Mark Suckerberg', status: '' },
      { id: 3, time: '09:58 AM', action: 'Verification completed', user: 'Thanudi', status: 'Pending' },
      { id: 4, time: '09:45 AM', action: 'Document processing', user: 'Since Johny', status: 'In Progress' },
      { id: 5, time: '09:20 AM', action: 'Verification completed', user: 'Buri Santoso', status: 'Valid' }
    ]
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // In a real app, you would call the API
        // const data = await getAnalyticsData(timeRange);
        // setAnalyticsData(data);
        
        // Using mock data for demonstration
        setTimeout(() => {
          setAnalyticsData(mockData);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const getStatusColor = (status) => {
    if (status === 'Valid') return 'text-green-400';
    if (status === 'Invalid') return 'text-red-400';
    if (status === 'Pending') return 'text-yellow-400';
    if (status === 'In Progress') return 'text-blue-400';
    return '';
  };

  const renderApplicationTrendChart = () => {
    if (!analyticsData) return null;
    
    const maxCount = Math.max(...analyticsData.applicationTrend.map(item => item.count));
    
    return (
      <div className="flex items-end h-40 gap-1 mt-4">
        {analyticsData.applicationTrend.map((day, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-600 hover:bg-blue-500 rounded-t" 
              style={{ height: `${(day.count / maxCount) * 100}%` }}
            ></div>
            <div className="text-xs mt-1 text-gray-400">{day.date}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderProcessingTimeChart = () => {
    if (!analyticsData) return null;
    
    const maxTime = Math.max(...analyticsData.processingTimeHistory.map(item => item.time));
    const minTime = Math.min(...analyticsData.processingTimeHistory.map(item => item.time)) * 0.9;
    
    return (
      <div className="relative h-40 mt-4">
        <svg className="w-full h-full">
          <polyline
            points={analyticsData.processingTimeHistory.map((point, index) => {
              const x = (index / (analyticsData.processingTimeHistory.length - 1)) * 100 + '%';
              const y = (1 - (point.time - minTime) / (maxTime - minTime)) * 90 + '%';
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          {analyticsData.processingTimeHistory.map((point, index) => {
            const x = (index / (analyticsData.processingTimeHistory.length - 1)) * 100 + '%';
            const y = (1 - (point.time - minTime) / (maxTime - minTime)) * 90 + '%';
            return (
              <circle 
                key={index} 
                cx={x} 
                cy={y} 
                r="3" 
                fill="#93c5fd" 
              />
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
          {analyticsData.processingTimeHistory.map((point, index) => (
            <div key={index}>{point.date}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
        
        <div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white py-2 px-4 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 90 days</option>
            <option value="year">This year</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : analyticsData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Summary Stats Cards */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Application Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-sm">Total Applications</div>
                <div className="text-2xl font-bold">{analyticsData.summary.totalApplications}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Processed</div>
                <div className="text-2xl font-bold">{analyticsData.summary.processedApplications}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Verified</div>
                <div className="text-2xl font-bold text-green-400">{analyticsData.summary.verifiedApplications}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Pending</div>
                <div className="text-2xl font-bold text-yellow-400">{analyticsData.summary.pendingVerification}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-gray-400 text-sm">Avg. Processing Time</div>
              <div className="text-xl font-medium text-blue-400">{analyticsData.summary.avgProcessingTime}</div>
            </div>
          </div>
          
          {/* Application Trend */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Application Trend</h3>
            {renderApplicationTrendChart()}
          </div>
          
          {/* Verification Status */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Verification Status</h3>
            <div className="relative pt-1">
              <div className="flex mb-2">
                <div className={`w-1/4 text-center ${getStatusColor('Valid')}`}>Valid</div>
                <div className={`w-1/4 text-center ${getStatusColor('Invalid')}`}>Invalid</div>
                <div className={`w-1/4 text-center ${getStatusColor('Pending')}`}>Pending</div>
                <div className={`w-1/4 text-center ${getStatusColor('In Progress')}`}>In Progress</div>
                </div>  
                <div className="flex mb-2">
                <div className={`w-1/4 text-center ${getStatusColor('Valid')}`}>{analyticsData.verificationStats.valid}</div>
                <div className={`w-1/4 text-center ${getStatusColor('Invalid')}`}>{analyticsData.verificationStats.invalid}</div>
                <div className={`w-1/4 text-center ${getStatusColor('Pending')}`}>{analyticsData.verificationStats.pending}</div>  
                <div className={`w-1/4 text-center ${getStatusColor('In Progress')}`}>{analyticsData.verificationStats.inProgress}</div>
                </div>  
                <div className="flex mb-2">
                <div className={`w-1/4 text-center ${getStatusColor('Valid')}`}>Verified</div>  
                <div className={`w-1/4 text-center ${getStatusColor('Invalid')}`}>Rejected</div>
                <div className={`w-1/4 text-center ${getStatusColor('Pending')}`}>Pending</div>
                <div className={`w-1/4 text-center ${getStatusColor('In Progress')}`}>In Progress</div>
                </div>  
                <div className="flex mb-2">
                <div className={`w-1/4 text-center ${getStatusColor('Valid')}`}>{analyticsData.verificationStats.validatedPercent}%</div>
                <div className={`w-1/4 text-center ${getStatusColor('Invalid')}`}>{analyticsData.verificationStats.rejectedPercent}%</div>
                <div className={`w-1/4 text-center ${getStatusColor('Pending')}`}>{analyticsData.verificationStats.pending}</div>
                <div className={`w-1/4 text-center ${getStatusColor('In Progress')}`}>{analyticsData.verificationStats.inProgress}</div>
                </div>
                            </div>  
                        </div> 
            
                      {/* Processing Time Chart */}
                      <div className="bg-gray-800 p-5 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Processing Time History</h3>
                        {renderProcessingTimeChart()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">No data available</div>
                  )}
                </div>
              );
            };
            
            export default AnalyticsDashboard;
            