import React, { useState, useEffect, useRef } from "react";
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
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";

const api = axios.create({
  baseURL: "https://main-production-7511.up.railway.app/"
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
  const [socket, setSocket] = useState(null);
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const socketRef = useRef(null);
  const searchTermRef = useRef("");

  useEffect(() => {
    localStorage.setItem("jobRole", searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  // Initialize WebSocket connection
  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("WebSocket Connected");
      setSocketStatus("connected");
      socketRef.current = ws;
      setSocket(ws);

      // Re-subscribe to current job if any
      if (searchTerm) {
        ws.send(
          JSON.stringify({
            subscribe: searchTerm,
          })
        );
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        const currentSearchTerm = searchTermRef.current;
        console.log("st", currentSearchTerm);

        // Handle different types of updates
        if (data.type === "db_update") {
          if (data.collection === "parsed_resumes" && currentSearchTerm) {
            console.log("Resume collection updated, refreshing data");
            fetchJobData(currentSearchTerm);
          } else if (data.collection === "jobs") {
            console.log("Jobs collection updated, refreshing job roles");
            fetchJobRoles();
          }
        } else if (data.type === "subscription") {
          console.log(
            `Subscription status: ${data.status} for job role: ${
              data.job_role || "unknown"
            }`
          );
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setSocketStatus("disconnected");
      // Attempt to reconnect after a delay
      setTimeout(() => {
        setSocket(null);
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setSocketStatus("error");
    };

    // Clean up on component unmount
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [searchTerm]);

  // Subscribe to specific job updates when job role changes
  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN && searchTerm) {
      // Send subscription message
      socket.send(
        JSON.stringify({
          subscribe: searchTerm,
        })
      );
      console.log(`Subscribed to updates for ${searchTerm}`);
    }
  }, [socket, searchTerm]);

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

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobData = async (role) => {
    try {
      setLoading(true);
      setHasSearched(true);

      const [
        summaryRes,
        scoreRes,
        experienceRes,
        degreeRes,
        skillsRes,
        candidatesRes,
      ] = await Promise.all([
        api.get(`/stats/summary/${role}`),
        api.get(`/stats/score-distribution/${role}`),
        api.get(`/stats/experience-distribution/${role}`),
        api.get(`/stats/degree-distribution/${role}`),
        api.get(`/stats/skill-distribution/${role}`),
        api.get(`/candidates/score-buckets/${role}`),
      ]);

      setCandidates(candidatesRes.data);

      const transformedData = {
        title: role,
        stats: {
          avgScore: Math.round(summaryRes.data.avg_score),
          cvsSubmitted: Math.round(summaryRes.data.submitted),
          cvsProcessed: Math.round(summaryRes.data.processed),
          cvsRejected: Math.round(summaryRes.data.rejected),
        },
        resumeScores: {
          labels: Object.keys(scoreRes.data),
          values: Object.values(scoreRes.data).map((value) => Math.round(value)),
        },
        experience: {
          labels: Object.keys(experienceRes.data),
          values: Object.values(experienceRes.data).map((value) => Math.round(value)),
        },
        degree: {
          labels: Object.keys(degreeRes.data),
          values: Object.values(degreeRes.data).map((value) => Math.round(value)),
        },
        skills: {
          labels: Object.keys(skillsRes.data),
          values: Object.values(skillsRes.data).map((value) => Math.round(value)),
        },
      };

      setJobData(transformedData);
    } catch (error) {
      console.error("Error fetching job data:", error);
      const dummyData = {
        title: role,
        stats: {
          avgScore: Math.floor(Math.random() * 500),
          cvsSubmitted: Math.floor(Math.random() * 800),
          cvsProcessed: Math.floor(Math.random() * 700),
          cvsRejected: Math.floor(Math.random() * 300),
        },
        resumeScores: {
          labels: ["0-20", "21-40", "41-60", "61-80", "81-100"],
          values: [5, 15, 30, 25, 10].map((v) =>
            Math.floor(v * (1 + Math.random() * 0.5))
          ),
        },
        experience: {
          labels: ["0-1", "2-4", "5-8", "9+"],
          values: [20, 45, 25, 10].map((v) =>
            Math.floor(v * (1 + Math.random() * 0.5))
          ),
        },
        degree: {
          labels: ["Bachelors", "Masters", "Diploma", "PhD", "Other"],
          values: [50, 30, 10, 5, 5].map((v) =>
            Math.floor(v * (1 + Math.random() * 0.5))
          ),
        },
        skills: {
          labels: ["JavaScript", "Python", "React", "Java", "SQL"],
          values: [50, 40, 30, 20, 10].map((v) =>
            Math.floor(v * (1 + Math.random() * 0.5))
          ),
        },
      };
      setJobData(dummyData);
      setCandidates({
        "0-20": [
          {
            name: "Test Candidate",
            education: "Test",
            experience: "0 years",
            cvLink: "#",
            score: 10,
          },
        ],
      });
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

      // Subscribe to job-specific updates via WebSocket
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            subscribe: matchedRole,
          })
        );
        console.log(`Subscribed to updates for ${matchedRole}`);
      }
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

    console.log("Selected score range:", scoreRange);
    console.log("Available candidates:", candidates[scoreRange]);

    if (candidates[scoreRange]) {
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

    const input = document.getElementById("report-content");
    const doc = new jsPDF("p", "pt", "a4");
    const options = {
      background: "#1e1e2f",
      scale: 2,
    };

    html2canvas(input, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = doc.internal.pageSize.getWidth() - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
      doc.save(`${jobData.title}_analytics_report.pdf`);
    });
  };

  return (
    <Box m="20px">
      {/* WebSocket Status Indicator */}

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
              onInputChange={(event, newInputValue) =>
                setSearchTerm(newInputValue)
              }
              sx={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: "5px",
              }}
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
                        {loadingRoles ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
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
                },
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            {/* Search Autocomplete */}
            <Box display="flex" alignItems="center" sx={{ width: "60%" }}>
              <Autocomplete
                freeSolo
                options={jobRoles}
                inputValue={searchTerm}
                onInputChange={(event, newInputValue) =>
                  setSearchTerm(newInputValue)
                }
                sx={{
                  width: 500,
                  backgroundColor: "#fff",
                  borderRadius: "5px",
                }}
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
                          {loadingRoles ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
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
                  },
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
                  },
                }}
              >
                Export as PDF
              </Button>
            )}
          </Box>

          {/* Loading Indicator */}
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={4}
            >
              <CircularProgress />
            </Box>
          )}

          {/* Display Content */}
          {!loading && jobData && (
            <div id="report-content">
              <Card sx={{ mt: 4, bgcolor: "#1e1e2f", color: "#ffffff" }}>
                <CardContent>
                  {/* HEADER */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}
                  >
                    <Typography variant="h4" fontWeight="600">
                      {jobData.title} Analytics Report
                    </Typography>
                    <Typography variant="subtitle1">
                      Generated on: {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* STATS - With Circular Progress */}
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    gap="20px"
                    mb={4}
                  >
                    {[
                      {
                        label: "Average Resume Score",
                        value: jobData.stats.avgScore,
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
                      // Calculate percentage for all stats except Average Score
                      const percent =
                        stat.label === "CVs Submitted"
                          ? 100
                          : stat.label === "Average Score"
                          ? null
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
                          {stat.label === "Average Resume Score" ? (
                            <>
                              <Typography
                                variant="h4"
                                color={stat.color}
                                fontWeight="bold"
                              >
                                {stat.value}
                              </Typography>
                              <Typography variant="h6" color="#ffffff" mt={1}>
                                {stat.label}
                              </Typography>
                            </>
                          ) : (
                            <>
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
                            </>
                          )}
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

                    {/* Score Range Buttons - closer and more spaced out */}
                    <Box
                      display="flex"
                      justifyContent="center"
                      gap={4}
                      mt={0.5}
                    >
                      {["0-20", "21-40", "41-60", "61-80", "81-100"].map(
                        (range) => (
                          <Button
                            key={range}
                            variant="contained"
                            onClick={() => {
                              setSelectedScoreRange(range);
                              setModalOpen(true);
                            }}
                            sx={{
                              backgroundColor: "#1976d2",
                              color: "#fff",
                              fontWeight: "bold",
                            }}
                          >
                            {range}
                          </Button>
                        )
                      )}
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
                          marker: {
                            colors: [
                              "#66bb6a",
                              "#42a5f5",
                              "#ef5350",
                              "#ab47bc",
                            ],
                          },
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
                          marker: {
                            colors: [
                              "#ffb74d",
                              "#4db6ac",
                              "#7986cb",
                              "#90a4ae",
                            ],
                          },
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
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      color="#ffffff"
                      mb={2}
                    >
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <Paper
          sx={{
            width: "80%",
            maxWidth: 600,
            maxHeight: "80vh",
            overflow: "auto",
            bgcolor: "#2a2a40",
            color: "#ffffff",
            p: 4,
            borderRadius: "10px",
            outline: "none",
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
            <Typography color="#ffffff">
              No candidates available for this score range
            </Typography>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default AnalyticsDashboard;
