// import axios from 'axios';

// // Create axios instance with base URL
// const jobs = axios.create({
//   baseURL: 'https://resumeparserjobscs3023.azurewebsites.net/api',
//   headers: {
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*'
//   }
// });

// // Add error handling interceptor
// api.interceptors.response.use(
//   response => response,
//   error => {
//     console.error('API Error:', error);
//     if (error.response) {
//       return Promise.reject(new Error(error.response.data.message || 'Error processing request'));
//     } else if (error.request) {
//       return Promise.reject(new Error('No response received from server. Please check your connection.'));
//     } else {
//       return Promise.reject(new Error('Error setting up the request: ' + error.message));
//     }
//   }
// );

// // Job-related API functions
// export const fetchJobs = async () => {
//   const response = await api.get('/jobs?code=yfdJdeNoFZzkQynk6p56ZETolRh1NqSpOaBYcTebXJO3AzFuWbJDmQ==');
//   return response.data;
// };

// export default jobs;