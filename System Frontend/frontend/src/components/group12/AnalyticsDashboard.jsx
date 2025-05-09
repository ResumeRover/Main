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

const api = axios.create({
  baseURL: "http://localhost:8000",
});

const AnalyticsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScoreRange, setSelectedScoreRange] = useState("");
  const [candidates, setCandidates] = useState({});
  const [jobRoles, setJobRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        setLoadingRoles(true);
        const response = await api.get("/jobs/titles");
        setJobRoles(response.data.titles);
      } catch (error) {
        console.error("Error fetching job roles:", error);
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
      setHasSearched(true);

      const [summaryRes, scoreRes, experienceRes, degreeRes, skillsRes] = await Promise.all([
        api.get(`/stats/summary/${role}`),
        api.get(`/stats/score-distribution/${role}`),
        api.get(`/stats/experience-distribution/${role}`),
        api.get(`/stats/degree-distribution/${role}`),
        api.get(`/stats/skill-distribution/${role}`),
      ]);

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
        skills: {
          labels: Object.keys(skillsRes.data),
          values: Object.values(skillsRes.data),
        }
      };

      setJobData(transformedData);
      
      // Fetch candidates for each score range from backend
      const scoreRanges = Object.keys(scoreRes.data);
      const candidatesData = {};
      
      for (const range of scoreRanges) {
        try {
          // This assumes you have a backend endpoint that returns candidates by score range
          const response = await api.get(`/candidates/by-score/${role}/${range}`);
          candidatesData[range] = response.data.candidates || [];
        } catch (error) {
          console.error(`Error fetching candidates for range ${range}:`, error);
          candidatesData[range] = [];
        }
      }
      
      setCandidates(candidatesData);

    } catch (error) {
      console.error("Error fetching job data:", error);
      // Fallback to empty data structure if API fails
      const emptyData = {
        title: role,
        stats: {
          cvsPassed: 0,
          cvsSubmitted: 0,
          cvsProcessed: 0,
          cvsRejected: 0,
        },
        resumeScores: {
          labels: ["0-20", "21-40", "41-60", "61-80", "81-100"],
          values: [0, 0, 0, 0, 0],
        },
        experience: {
          labels: ["0-1", "2-4", "5-8", "9+"],
          values: [0, 0, 0, 0],
        },
        degree: {
          labels: ["Bachelors", "Masters", "Diploma", "PhD", "Other"],
          values: [0, 0, 0, 0, 0],
        },
        skills: {
          labels: [],
          values: [],
        }
      };
      setJobData(emptyData);
      setCandidates({});
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
      console.warn("No matching job role found");
    }
  };

  const handleBarClick = (data) => {
    if (!jobData || !jobData.resumeScores) {
      console.error("Job data not loaded yet");
      return;
    }
  
    const clickedBarIndex = data.points[0].pointIndex;
    const scoreRange = jobData.resumeScores.labels[clickedBarIndex];
    
    if (candidates[scoreRange] && candidates[scoreRange].length > 0) {
      setSelectedScoreRange(scoreRange);
      setModalOpen(true);
    } else {
      console.warn("No candidates found for score range:", scoreRange);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedScoreRange("");
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
      {/* Initial state - centered search bar */}
      {!hasSearched && (
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          height="70vh"
        >
          <Box 
            display="flex" 
            alignItems="center" 
            width="100%"
            maxWidth="600px"
            mb={4}
          >
            <Autocomplete
              freeSolo
              options={jobRoles}
              inputValue={searchTerm}
              onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
              sx={{ width: "100%", backgroundColor: "#fff", borderRadius: "5px" }}
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
          <Typography variant="h5" color="textSecondary">
            Search for a job role to view analytics
          </Typography>
        </Box>
      )}

      {/* After search - normal layout */}
      {hasSearched && (
        <>
          {/* Header with Search and Export */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            {/* Search Autocomplete */}
            <Box display="flex" alignItems="center" sx={{ width: '60%' }}>
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

            {/* Export PDF Button - Top Right */}
            {!loading && jobData && (
              <Button
                onClick={exportToPDF}
                variant="contained"
                sx={{
                  backgroundColor: "#4caf50",
                  color: "#ffffff",
                  fontWeight: "bold",
                  padding: "10px 30px",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "#388e3c",
                  }
                }}
              >
                Export as PDF
              </Button>
            )}
          </Box>

          {/* Loading Indicator */}
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
              <CircularProgress />
            </Box>
          )}

          {/* Display Content */}
          {!loading && jobData && (
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
                      config={{
                        displayModeBar: true,
                        responsive: true,
                      }}
                      onClick={handleBarClick}
                    />

                    {/* Score Range Buttons */}
                    <Box display="flex" justifyContent="center" gap={4} mt={0.5}>
                      {jobData.resumeScores.labels.map((range) => (
                        <Button
                          key={range}
                          variant="contained"
                          onClick={() => {
                            setSelectedScoreRange(range);
                            setModalOpen(true);
                          }}
                          sx={{ backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold" }}
                        >
                          {range}
                        </Button>
                      ))}
                    </Box>
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

                  {/* Candidates by Skill - Horizontal Bar */}
                  <Box gridColumn="span 12" bgcolor="#1e1e2f" p="20px">
                    <Typography variant="h5" fontWeight="600" color="#ffffff" mb={2}>
                      Candidates by Skill
                    </Typography>
                    <Plot
                      data={[
                        {
                          type: "bar",
                          x: jobData.skills.values,
                          y: jobData.skills.labels,
                          orientation: "h",
                          marker: { color: "#81c784" },
                        },
                      ]}
                      layout={{
                        autosize: true,
                        paper_bgcolor: "#1e1e2f",
                        plot_bgcolor: "#1e1e2f",
                        font: { color: "#ffffff" },
                        margin: { l: 100, r: 20, t: 20, b: 30 },
                      }}
                      style={{ width: "100%", height: "300px" }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Modal for Candidate Details */}
      <Modal 
        open={modalOpen} 
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <Paper
          sx={{
            width: '80%',
            maxWidth: 600,
            maxHeight: '80vh',
            overflow: 'auto',
            bgcolor: '#2a2a40',
            color: '#ffffff',
            p: 4,
            borderRadius: '10px',
            outline: 'none',
          }}
        >
          <Typography variant="h6" fontWeight="600" mb={3} color="#ffffff">
            Candidates with Score: {selectedScoreRange}
          </Typography>
          {selectedScoreRange && candidates[selectedScoreRange] ? (
            candidates[selectedScoreRange].map((candidate, index) => (
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
                <Typography variant="body2">
                  <strong>Score:</strong> {candidate.score}
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
            ))
          ) : (
            <Typography color="#ffffff">No candidates available for this score range</Typography>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default AnalyticsDashboard;