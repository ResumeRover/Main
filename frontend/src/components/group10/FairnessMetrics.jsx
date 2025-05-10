import { useState, useEffect } from 'react';
import { getFairnessMetrics } from '../../services/api';

const FairnessMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last30');
  const [jobFilter, setJobFilter] = useState('all');

  // Mock data for demonstration
  const mockMetricsData = {
    overallFairness: 87,
    demographicParity: 0.92,
    equalOpportunity: 0.89,
    predictiveEquality: 0.91,
    disparateImpact: {
      gender: 0.93,
      age: 0.87,
      education: 0.95
    },
    biasAnalysis: [
      { category: "Gender", bias: 0.07, threshold: 0.1, status: "Acceptable" },
      { category: "Age Group", bias: 0.13, threshold: 0.1, status: "Needs Review" },
      { category: "Education", bias: 0.05, threshold: 0.1, status: "Acceptable" },
      { category: "Work Experience", bias: 0.08, threshold: 0.1, status: "Acceptable" },
      { category: "Location", bias: 0.12, threshold: 0.1, status: "Needs Review" }
    ],
    recentAlerts: [
      { id: 1, date: "2024-12-01", description: "Age group bias detected in Software Engineer role", severity: "Medium" },
      { id: 2, date: "2024-11-25", description: "Location-based skew in Data Scientist applications", severity: "Low" },
      { id: 3, date: "2024-11-18", description: "Educational background imbalance affecting scoring", severity: "Medium" }
    ],
    featureImportance: [
      { feature: "Skills Match", importance: 0.35, fairnessImpact: "Low" },
      { feature: "Experience Years", importance: 0.25, fairnessImpact: "Medium" },
      { feature: "Education Level", importance: 0.20, fairnessImpact: "High" },
      { feature: "Past Roles", importance: 0.12, fairnessImpact: "Low" },
      { feature: "Project Count", importance: 0.08, fairnessImpact: "Low" }
    ]
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // In a real app, you would call the API
        // const data = await getFairnessMetrics(timeRange, jobFilter);
        // setMetrics(data);
        
        // Using mock data for demonstration
        setTimeout(() => {
          setMetrics(mockMetricsData);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Failed to fetch fairness metrics:', err);
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [timeRange, jobFilter]);

  const getBiasStatusColor = (status) => {
    if (status === "Acceptable") return "text-green-400";
    if (status === "Needs Review") return "text-yellow-400";
    return "text-red-400";
  };

  const getAlertSeverityColor = (severity) => {
    if (severity === "Low") return "bg-blue-900/30 text-blue-400 border-blue-700";
    if (severity === "Medium") return "bg-yellow-900/30 text-yellow-400 border-yellow-700";
    return "bg-red-900/30 text-red-400 border-red-700";
  };

  const getFairnessImpactColor = (impact) => {
    if (impact === "Low") return "text-green-400";
    if (impact === "Medium") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg text-white">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">AI Fairness Metrics</h2>
        
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <div>
            <label htmlFor="time-range" className="block text-sm font-medium text-gray-400 mb-1">Time Range</label>
            <select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white py-1 px-3 rounded focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="year">This year</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="job-filter" className="block text-sm font-medium text-gray-400 mb-1">Job Role</label>
            <select
              id="job-filter"
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white py-1 px-3 rounded focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="all">All Positions</option>
              <option value="software-engineer">Software Engineer</option>
              <option value="data-scientist">Data Scientist</option>
              <option value="ux-designer">UX Designer</option>
              <option value="product-manager">Product Manager</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overall Fairness Score */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Overall Fairness Score</h3>
            <div className="text-center">
              <div className="inline-block relative">
                <svg className="w-32 h-32">
                  <circle
                    className="text-gray-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-blue-500"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                    strokeDasharray={`${2 * Math.PI * 56 * metrics.overallFairness / 100} ${2 * Math.PI * 56 * (1 - metrics.overallFairness / 100)}`}
                    strokeDashoffset={2 * Math.PI * 56 * 0.25}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-3xl font-bold">{metrics.overallFairness}%</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-sm text-center">
              <div>
                <div className="text-gray-400">Demographic Parity</div>
                <div className="font-medium text-blue-400">{metrics.demographicParity.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400">Equal Opportunity</div>
                <div className="font-medium text-green-400">{metrics.equalOpportunity.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400">Predictive Equality</div>
                <div className="font-medium text-purple-400">{metrics.predictiveEquality.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          {/* Disparate Impact Analysis */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Disparate Impact Analysis</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Gender</span>
                  <span className="text-sm text-blue-400">{(metrics.disparateImpact.gender * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${metrics.disparateImpact.gender * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Age</span>
                  <span className="text-sm text-yellow-400">{(metrics.disparateImpact.age * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${metrics.disparateImpact.age * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Education</span>
                  <span className="text-sm text-green-400">{(metrics.disparateImpact.education * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${metrics.disparateImpact.education * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              * Scores closer to 100% indicate lower disparate impact
            </div>
          </div>
          
          {/* Bias Alerts */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Recent Fairness Alerts</h3>
            <div className="space-y-3">
              {metrics.recentAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`border px-4 py-2 rounded text-sm ${getAlertSeverityColor(alert.severity)}`}
                >
                  <div className="flex justify-between">
                    <div>{alert.description}</div>
                    <div className="text-xs">{alert.date}</div>
                  </div>
                  <div className="text-xs mt-1">
                    Severity: {alert.severity}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bias Analysis by Category */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Bias Analysis by Category</h3>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-400 px-2 py-1">Category</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-2 py-1">Bias</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics.biasAnalysis.map((item, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="text-sm px-2 py-2">{item.category}</td>
                    <td className="text-sm px-2 py-2">{item.bias.toFixed(2)}</td>
                    <td className={`text-sm px-2 py-2 ${getBiasStatusColor(item.status)}`}>
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-400 mt-2">
              * Threshold for review: 0.10
            </div>
          </div>
          
          {/* Feature Importance */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Feature Importance & Fairness Impact</h3>
            <div className="space-y-3">
              {metrics.featureImportance.map((feature, index) => (
                <div key={index} className="border border-gray-700 rounded p-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{feature.feature}</span>
                    <span className={`text-xs ${getFairnessImpactColor(feature.fairnessImpact)}`}>
                      {feature.fairnessImpact} Impact
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-400 mb-1">Importance: {(feature.importance * 100).toFixed(0)}%</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${feature.importance * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-lg font-medium mb-3">AI Fairness Recommendations</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex">
                <div className="text-yellow-400 mr-2">⚠️</div>
                <div>Review age-based scoring factors in the ranking algorithm</div>
              </li>
              <li className="flex">
                <div className="text-blue-400 mr-2">ℹ️</div>
                <div>Consider additional data balancing for location-based applicants</div>
              </li>
              <li className="flex">
                <div className="text-green-400 mr-2">✓</div>
                <div>Gender balance is within acceptable parameters</div>
              </li>
              <li className="flex">
                <div className="text-yellow-400 mr-2">⚠️</div>
                <div>Educational background may be over-weighted in the algorithm</div>
              </li>
              <li className="flex">
                <div className="text-blue-400 mr-2">ℹ️</div>
                <div>Consider adding more diverse training examples to the model</div>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded">
          Failed to load fairness metrics data
        </div>
      )}
    </div>
  );
};

export default FairnessMetrics;