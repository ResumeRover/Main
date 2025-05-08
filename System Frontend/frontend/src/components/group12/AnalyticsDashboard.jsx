import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Autocomplete,
  Modal,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import Plot from "react-plotly.js";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Initialize axios with base URL
const api = axios.create({
  baseURL: "http://localhost:8000", // Update with your backend URL
});

const AnalyticsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState(() => {
    const stored = localStorage.getItem("jobData");
    return stored ? JSON.parse(stored) : null;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch available job roles when component mounts
  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        setLoadingRoles(true);
        const response = await api.get("/jobs/titles");
        setJobRoles(response.data.titles);
      } catch (error) {
        console.error("Error fetching job roles:", error);
        // Fallback to some default roles if API fails
        setJobRoles(["SSE", "Software Engineer", "Data Scientist"]);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchJobRoles();
  }, []);

  const fetchJobData = async (role) => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [summaryRes, scoreRes, experienceRes, degreeRes] = await Promise.all([
        api.get(`/stats/summary/${role}`),
        api.get(`/stats/score-distribution/${role}`),
        api.get(`/stats/experience-distribution/${role}`),
        api.get(`/stats/degree-distribution/${role}`),
      ]);

      // Transform data to match frontend format
      const transformedData = {
        title: role,
        stats: {
          cvsPassed: summaryRes.data.passed,
          cvsSubmitted: summaryRes.data.submitted,
          cvsProcessed: summaryRes.data.processed,
          cvsRejected: summaryRes.data.rejected,
        },
        resumeScores: {
          labels: Object.keys(scoreRes.data),
          values: Object.values(scoreRes.data),
        },
        experience: {
          labels: Object.keys(experienceRes.data),
          values: Object.values(experienceRes.data),
        },
        degree: {
          labels: Object.keys(degreeRes.data),
          values: Object.values(degreeRes.data),
        },
      };

      setJobData(transformedData);
      localStorage.setItem("jobData", JSON.stringify(transformedData));
      
      // For demo purposes - in a real app you would fetch actual candidates
      setCandidates([
        { name: "John Doe", education: "Bachelors in CS", experience: "2 years", cvLink: "#" },
        { name: "Jane Smith", education: "Masters in AI", experience: "4 years", cvLink: "#" },
        { name: "Alice Johnson", education: "Diploma in IT", experience: "1 year", cvLink: "#" },
        { name: "Bob Brown", education: "PhD in ML", experience: "6 years", cvLink: "#" },
      ]);
      
    } catch (error) {
      console.error("Error fetching job data:", error);
      // Fallback to dummy data if API fails
      const dummyData = {
        title: role,
        stats: {
          cvsPassed: Math.floor(Math.random() * 500),
          cvsSubmitted: Math.floor(Math.random() * 800),
          cvsProcessed: Math.floor(Math.random() * 700),
          cvsRejected: Math.floor(Math.random() * 300),
        },
        resumeScores: {
          labels: ["0-20", "21-40", "41-60", "61-80", "81-100"],
          values: [5, 15, 30, 25, 10].map(v => Math.floor(v * (1 + Math.random() * 0.5))),
        },
        experience: {
          labels: ["0-1", "2-4", "5-8", "9+"],
          values: [20, 45, 25, 10].map(v => Math.floor(v * (1 + Math.random() * 0.5))),
        },
        degree: {
          labels: ["Bachelors", "Masters", "Diploma", "PhD", "Other"],
          values: [50, 30, 10, 5, 5].map(v => Math.floor(v * (1 + Math.random() * 0.5))),
        },
      };
      setJobData(dummyData);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm) return;
    const matchedRole = jobRoles.find((role) =>
      role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matchedRole) {
      fetchJobData(matchedRole);
    } else {
      // Optionally show error message to user
      console.warn("No matching job role found");
    }
  };

  const handleBarClick = (event) => {
    const barIndex = event.points[0].pointIndex;
    setSelectedBarIndex(barIndex);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBarIndex(null);
  };

  const exportToPDF = () => {
    if (!jobData) return;

    const input = document.getElementById('report-content');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: '#1e1e2f',
      scale: 2,
    };

    html2canvas(input, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = doc.internal.pageSize.getWidth() - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      doc.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
      doc.save(`${jobData.title}_analytics_report.pdf`);
    });
  };

  return (
    <Box m="20px">
      {/* Search Autocomplete */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
        <Autocomplete
          freeSolo
          options={jobRoles}
          inputValue={searchTerm}
          onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
          sx={{ width: 500, backgroundColor: "#fff", borderRadius: "5px" }}
          loading={loadingRoles}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Search Job Role" 
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingRoles ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <Button
          onClick={handleSearch}
          disabled={loadingRoles}
          sx={{
            ml: 2,
            backgroundColor: "#1976d2",
            color: "#ffffff",
            fontWeight: "bold",
            padding: "10px 20px",
            "&:disabled": {
              backgroundColor: "#cccccc",
            }
          }}
        >
          Search
        </Button>
      </Box>

      {/* Loading Indicator */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Display Content */}
      {!loading && jobData && (
        <>
          <div id="report-content">
            <Card sx={{ mt: 4, bgcolor: "#1e1e2f", color: "#ffffff" }}>
              <CardContent>
                {/* HEADER */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                  <Typography variant="h4" fontWeight="600">
                    {jobData.title} Analytics Report
                  </Typography>
                  <Typography variant="subtitle1">
                    Generated on: {new Date().toLocaleDateString()}
                  </Typography>
                </Box>

                {/* STATS - With Circular Progress */}
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px" mb={4}>
                  {[
                    {
                      label: "CVs Passed",
                      value: jobData.stats.cvsPassed,
                      color: "#66bb6a",
                    },
                    {
                      label: "CVs Processed",
                      value: jobData.stats.cvsProcessed,
                      color: "#42a5f5",
                    },
                    {
                      label: "CVs Rejected",
                      value: jobData.stats.cvsRejected,
                      color: "#ef5350",
                    },
                    {
                      label: "CVs Submitted",
                      value: jobData.stats.cvsSubmitted,
                      color: "#ffa726",
                    },
                  ].map((stat, index) => {
                    const percent =
                      stat.label === "CVs Submitted"
                        ? 100
                        : Math.min(
                            (stat.value / jobData.stats.cvsSubmitted) * 100,
                            100
                          );

                    return (
                      <Box
                        key={index}
                        gridColumn="span 3"
                        bgcolor="#2a2a40"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        p={2}
                        borderRadius="10px"
                      >
                        <CircularProgress
                          variant="determinate"
                          value={percent}
                          size={80}
                          thickness={5}
                          sx={{
                            color: stat.color,
                            mb: 1,
                          }}
                        />
                        <Typography variant="h6" color="#ffffff">
                          {stat.label}
                        </Typography>
                        <Typography variant="body2" color="#aaa">
                          {stat.value} ({Math.round(percent)}%)
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                {/* Resume Score Distribution - Bar Chart */}
                <Box gridColumn="span 12" p="20px">
                  <Typography variant="h5" fontWeight="600" mb={2}>
                    Resume Score Distribution
                  </Typography>
                  <Plot
                    data={[
                      {
                        type: "bar",
                        x: jobData.resumeScores.labels,
                        y: jobData.resumeScores.values,
                        marker: { color: "#42a5f5" },
                      },
                    ]}
                    layout={{
                      autosize: true,
                      margin: { t: 20 },
                      paper_bgcolor: "#1e1e2f",
                      plot_bgcolor: "#1e1e2f",
                      font: { color: "#ffffff" },
                      title: "",
                    }}
                    style={{ width: "100%", height: "300px" }}
                    onClick={handleBarClick}
                  />
                </Box>

                {/* Experience Level - Pie Chart */}
                <Box gridColumn="span 6" p="20px">
                  <Typography variant="h5" fontWeight="600" mb={2}>
                    Candidates by Experience Level (Years)
                  </Typography>
                  <Plot
                    data={[
                      {
                        type: "pie",
                        values: jobData.experience.values,
                        labels: jobData.experience.labels,
                        textinfo: "label+percent",
                        marker: { colors: ["#66bb6a", "#42a5f5", "#ef5350", "#ab47bc"] },
                      },
                    ]}
                    layout={{
                      autosize: true,
                      paper_bgcolor: "#1e1e2f",
                      font: { color: "#ffffff" },
                      margin: { t: 0, b: 0 },
                    }}
                    style={{ width: "100%", height: "300px" }}
                  />
                </Box>

                {/* Degree Distribution - Pie Chart */}
                <Box gridColumn="span 6" p="20px">
                  <Typography variant="h5" fontWeight="600" mb={2}>
                    Candidates by Degree
                  </Typography>
                  <Plot
                    data={[
                      {
                        type: "pie",
                        values: jobData.degree.values,
                        labels: jobData.degree.labels,
                        textinfo: "label+percent",
                        marker: { colors: ["#ffb74d", "#4db6ac", "#7986cb", "#90a4ae"] },
                      },
                    ]}
                    layout={{
                      autosize: true,
                      paper_bgcolor: "#1e1e2f",
                      font: { color: "#ffffff" },
                      margin: { t: 0, b: 0 },
                    }}
                    style={{ width: "100%", height: "300px" }}
                  />
                </Box>
              </CardContent>
            </Card>
          </div>

          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              onClick={exportToPDF}
              variant="contained"
              sx={{
                backgroundColor: "#1976d2",
                color: "#ffffff",
                fontWeight: "bold",
                padding: "10px 30px",
                fontSize: "16px",
              }}
            >
              Export Report as PDF
            </Button>
          </Box>
        </>
      )}

      {/* Modal for Bar Details */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "#2a2a40",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" fontWeight="600" mb={3} color="#ffffff">
            Candidate Details
          </Typography>
          {selectedBarIndex !== null && (
            <Box>
              {candidates.map((candidate, index) => (
                <Box
                  key={index}
                  mb={2}
                  p={3}
                  border="1px solid #444"
                  borderRadius="10px"
                  bgcolor="#1e1e2f"
                  color="#ffffff"
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {candidate.name}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    <strong>Education:</strong> {candidate.education}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Experience:</strong> {candidate.experience}
                  </Typography>
                  <Button
                    href={candidate.cvLink}
                    target="_blank"
                    sx={{
                      mt: 2,
                      backgroundColor: "#42a5f5",
                      color: "#fff",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#1e88e5",
                      },
                    }}
                  >
                    View CV
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default AnalyticsDashboard;