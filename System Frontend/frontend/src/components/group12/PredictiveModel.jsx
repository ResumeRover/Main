import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PredictiveModel = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecastPeriod, setForecastPeriod] = useState('month');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/predictions?period=${forecastPeriod}`);
        setPredictionData(response.data);
      } catch (err) {
        setError('Failed to fetch prediction data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [forecastPeriod]);

  if (loading) return <div className="text-white text-center py-8">Loading prediction data...</div>;
  if (error) return <div className="text-red-400 text-center py-8">{error}</div>;
  if (!predictionData) return <div className="text-gray-400 text-center py-8">No prediction data available</div>;

  return (
    <div className="bg-[#1e293b] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Predictive Analytics</h2>
        <select 
          value={forecastPeriod} 
          onChange={(e) => setForecastPeriod(e.target.value)}
          className="bg-[#0f172a] border border-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#057a8d]"
        >
          <option value="week">Next Week</option>
          <option value="month">Next Month</option>
          <option value="quarter">Next Quarter</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-[#0f172a] p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-white">Expected Application Volume</h3>
          <div className="h-64 relative">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gray-700"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-gray-700"></div>
            
            <div className="relative h-52">
              {predictionData.volumeForecasts.map((point, index, arr) => {
                const x = (index / (arr.length - 1)) * 100;
                const y = 100 - ((point.value / predictionData.volumeForecasts.reduce((max, p) => Math.max(max, p.value), 0)) * 100);
                const isPast = point.type === 'historical';
                
                return (
                  <React.Fragment key={index}>
                    <div 
                      className={`absolute w-2 h-2 rounded-full transform -translate-x-1 -translate-y-1 ${
                        isPast ? 'bg-gray-400' : 'bg-[#10b981]'
                      }`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                    ></div>
                    
                    {index < arr.length - 1 && arr[index + 1].type === point.type && (
                      <div 
                        className={`absolute h-0.5 ${isPast ? 'bg-gray-400' : 'bg-[#10b981]'}`}
                        style={{ 
                          left: `${x}%`, 
                          top: `${y}%`, 
                          width: `${100 / (arr.length - 1)}%`,
                          transformOrigin: 'left center',
                          transform: `rotate(${Math.atan2(
                            (100 - ((arr[index + 1].value / predictionData.volumeForecasts.reduce((max, p) => Math.max(max, p.value), 0)) * 100)) - y,
                            100 / (arr.length - 1)
                          )}rad)`
                        }}
                      ></div>
                    )}
                    
                    <div 
                      className="absolute text-xs text-gray-400 transform -rotate-45 origin-top-left"
                      style={{ left: `${x}%`, bottom: '-24px' }}
                    >
                      {point.date}
                    </div>
                  </React.Fragment>
                );
              })}
              
              {/* Divider between historical and forecast data */}
              {predictionData.volumeForecasts.findIndex(p => p.type === 'forecast') > 0 && (
                <div 
                  className="absolute h-full w-px border-l border-dashed border-yellow-500"
                  style={{ 
                    left: `${(predictionData.volumeForecasts.findIndex(p => p.type === 'forecast') - 0.5) / (predictionData.volumeForecasts.length - 1) * 100}%`
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-[#0f172a] p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-white">Verification Success Prediction</h3>
          <div className="h-64 flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="4"
                  />
                  <path 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeDasharray={`${predictionData.verificationSuccessRate}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                  {predictionData.verificationSuccessRate}%
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#0c1320] rounded-lg">
                <p className="text-sm text-gray-400">Success Rate Change</p>
                <p className={`text-lg font-medium ${predictionData.successRateChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {predictionData.successRateChange >= 0 ? '+' : ''}{predictionData.successRateChange}%
                </p>
              </div>
              <div className="p-3 bg-[#0c1320] rounded-lg">
                <p className="text-sm text-gray-400">Confidence</p>
                <p className="text-lg font-medium text-white">{predictionData.confidenceLevel}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#0f172a] p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-white">Predicted Trends</h3>
        <div className="grid grid-cols-3 gap-4">
          {predictionData.trends.map((trend, index) => (
            <div key={index} className="p-3 bg-[#0c1320] rounded-lg">
              <p className="text-sm text-gray-400">{trend.name}</p>
              <div className="flex items-center mt-2">
                <div className="flex-1 h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-2 bg-[#10b981] rounded-full" 
                    style={{ width: `${trend.value}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-white">{trend.value}%</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">{trend.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictiveModel;
