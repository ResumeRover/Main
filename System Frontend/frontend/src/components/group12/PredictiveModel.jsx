import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import Plot from 'react-plotly.js';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
});


const PredictiveModelPage = () => {
  const [jobRole, setJobRole]  = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setErrorMessage('');
      setDashboardData(null);
      setLoading(true);

      // Use jobRole from params or localStorage fallback
      const jobRole = localStorage.getItem('jobRole') 
      setJobRole(jobRole);

      const response = await api.get(`/api/dashboard?job_role=${encodeURIComponent(jobRole)}`);
      if (response.data.status === 'error') {
        setErrorMessage(response.data.message);
      } else {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setErrorMessage('Failed to fetch forecast data');
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, [jobRole]);

  const getPlotData = () => {
    if (!dashboardData || dashboardData.status !== 'success') return [];

    const filteredData = dashboardData.forecast_chart_data;
    const historical = filteredData.filter(d => d.type === 'Historical');
    const forecast = filteredData.filter(d => d.type === 'Forecast');

    return [
      {
        x: historical.map(d => d.date),
        y: historical.map(d => d.value),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Historical',
        line: { color: '#42a5f5' },
        marker: { size: 6 },
      },
      {
        x: forecast.map(d => d.date),
        y: forecast.map(d => d.value),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Forecast',
        line: { color: '#ef5350', dash: 'dash' },
        marker: { size: 6 },
      },
    ];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m="20px"  minHeight="100vh">
      <Typography variant="h4" fontWeight="600" color="#ffffff" mb={3}>
        Application Forecast for {jobRole}
      </Typography>
      <Box bgcolor="#1e1e2f" p="20px" borderRadius="5px">
        {errorMessage ? (
          <Typography variant="h6" color="error">
            {errorMessage}
          </Typography>
        ) : dashboardData && dashboardData.status === 'success' ? (
          <Plot
            data={getPlotData()}
            layout={{
              autosize: true,
              paper_bgcolor: '#1e1e2f',
              plot_bgcolor: '#1e1e2f',
              font: { color: '#ffffff' },
              title: {
                text: `Forecast from ${dashboardData.job_opening_date} to ${dashboardData.job_closing_date || 'Future'}`,
                font: { color: '#ffffff' },
              },
              xaxis: {
                title: 'Date',
                range: [
                  dashboardData.job_opening_date,
                  dashboardData.job_closing_date || dashboardData.forecast_chart_data.slice(-1)[0].date,
                ],
                gridcolor: '#444',
              },
              yaxis: {
                title: 'Applications',
                autorange: true,
                gridcolor: '#444',
              },
              showlegend: true,
              margin: { t: 50, b: 100, l: 50, r: 50 },
              height: 500,
            }}
            style={{ width: '100%' }}
            useResizeHandler
          />
        ) : (
          <Typography variant="h6" color="#ffffff">
            No data available
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PredictiveModelPage;