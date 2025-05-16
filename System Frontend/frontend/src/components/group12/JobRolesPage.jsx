import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Plot from "react-plotly.js";
import axios from "axios";

// Initialize axios with base URL
const api = axios.create({
  baseURL: "https://main-production-7511.up.railway.app/"
});


const JobRolesPage = () => {
  const navigate = useNavigate();
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await api.get("/jobs/titles");
        const titles = response.data.titles;
        
        // Get counts for each job role to calculate percentages
        const rolesWithCounts = await Promise.all(
          titles.map(async (title) => {
            const summary = await api.get(`/stats/summary/${title}`);
            return {
              name: title,
              count: summary.data.submitted,
            };
          })
        );

        // Calculate percentages
        const total = rolesWithCounts.reduce((sum, role) => sum + role.count, 0);
        const rolesWithPercentages = rolesWithCounts.map(role => ({
          name: role.name,
          percentage: total > 0 ? Math.round((role.count / total) * 100) : 0,
        }));

        setJobRoles(rolesWithPercentages);
      } catch (err) {
        console.error("Error fetching job roles:", err);
        setError("Failed to load job roles");
      } finally {
        setLoading(false);
      }
    };

    fetchJobRoles();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Typography variant="h4" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="600" color="#ffffff" mb={3}>
        Job Roles Overview
      </Typography>

      {jobRoles.length > 0 && (
        <>
          <Box bgcolor="#1e1e2f" p="20px" mb={3}>
            <Typography variant="h5" fontWeight="600" color="#ffffff" mb={2}>
              Job Roles Distribution
            </Typography>
            <Plot
              data={[
                {
                  type: "pie",
                  values: jobRoles.map((role) => role.percentage),
                  labels: jobRoles.map((role) => role.name),
                  textinfo: "label+percent",
                  marker: {
                    colors: [
                      "#42a5f5",
                      "#66bb6a",
                      "#ffb74d",
                      "#ef5350",
                      "#ab47bc",
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
              style={{ width: "100%", height: "400px" }}
              onClick={(event) => {
                const clickedLabel = event.points[0].label;
                navigate(`/analytics-dashboard/${encodeURIComponent(clickedLabel)}`);
              }}
            />
          </Box>

          <List>
            {jobRoles.map((role) => (
              <ListItem key={role.name} disablePadding>
                <ListItemButton
                  onClick={() => {
                    console.log("Storing job role:", role.name);
                    localStorage.setItem("jobRole", role.name);
                    navigate(`/analytics-dashboard/${encodeURIComponent(role.name)}`);
                    
                  }}
                  sx={{ bgcolor: "#1e1e2f", mb: 1, borderRadius: "5px" }}
                >
                  <ListItemText
                    primary={role.name}
                    secondary={`${role.percentage}% of total applications`}
                    primaryTypographyProps={{
                      color: "#ffffff",
                      fontWeight: "600",
                    }}
                    secondaryTypographyProps={{
                      color: "#aaaaaa",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {jobRoles.length === 0 && (
        <Typography variant="h6" color="#ffffff">
          No job roles found
        </Typography>
      )}
    </Box>
  );
};

export default JobRolesPage;