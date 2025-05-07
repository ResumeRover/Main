import { Box, Button, Typography } from "@mui/material";
import Header from "./header";
import StatBox from "./statBox";
import Plot from "react-plotly.js";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CancelIcon from '@mui/icons-material/Cancel';


const AnalyticsDashboard = () => {
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Resume Analytics Overview" />
        <Button
          sx={{
            backgroundColor: "#1976d2", // Blue
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          Download Reports
        </Button>
      </Box>

      {/* STATS */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
        <Box gridColumn="span 3" bgcolor="#1e1e2f" display="flex" alignItems="center" justifyContent="center" p="10px">
          <StatBox title="325" subtitle="CVs Passed" icon={<AssignmentTurnedInIcon sx={{ color: "#4caf50", fontSize: "26px" }} />} />
        </Box>
        <Box gridColumn="span 3" bgcolor="#1e1e2f" display="flex" alignItems="center" justifyContent="center">
          <StatBox title="512" subtitle="CVs Submitted" icon={<UploadFileIcon sx={{ color: "#4caf50", fontSize: "26px" }} />} />
        </Box>
        <Box gridColumn="span 3" bgcolor="#1e1e2f" display="flex" alignItems="center" justifyContent="center">
          <StatBox title="480" subtitle="CVs Processed" icon={<SettingsSuggestIcon sx={{ color: "#4caf50", fontSize: "26px" }} />} />
        </Box>
        <Box gridColumn="span 3" bgcolor="#1e1e2f" display="flex" alignItems="center" justifyContent="center">
          <StatBox title="187" subtitle="CVs Rejected" icon={<CancelIcon sx={{ color: "#f44336", fontSize: "26px" }} />} />
        </Box>

        {/* Resume Score Distribution - Bar Chart */}
        <Box gridColumn="span 12" bgcolor="#1e1e2f" p="20px">
          <Typography variant="h5" fontWeight="600" color="#ffffff" mb={2}>
            Resume Score Distribution
          </Typography>
          <Plot
            data={[{
              type: 'bar',
              x: ['0-20', '21-40', '41-60', '61-80', '81-100'],
              y: [5, 15, 30, 25, 10],
              marker: { color: "#42a5f5" },
            }]}
            layout={{
              autosize: true,
              margin: { t: 20 },
              paper_bgcolor: "#1e1e2f",
              plot_bgcolor: "#1e1e2f",
              font: { color: "#ffffff" },
            }}
            style={{ width: "100%", height: "300px" }}
          />
        </Box>

        {/* Experience & Degree - Pie Charts */}
        <Box gridColumn="span 6" bgcolor="#1e1e2f" p="20px">
          <Typography variant="h5" fontWeight="600" color="#ffffff" mb={2}>
            Candidates by Experience Level (Years)
          </Typography>
          <Plot
            data={[{
              type: 'pie',
              values: [20, 45, 25, 10],
              labels: ['0-1', '2-4', '5-8', '9+'],
              textinfo: "label+percent",
              marker: { colors: ['#66bb6a', '#42a5f5', '#ef5350', '#ab47bc'] }
            }]}
            layout={{
              autosize: true,
              paper_bgcolor: "#1e1e2f",
              font: { color: "#ffffff" },
              margin: { t: 0, b: 0 },
              legend: {
                x: -0.1,
                y: 0.5,
                xanchor: 'right',
                orientation: 'v',
                font: { color: "#ffffff" },
              },
            }}
            style={{ width: "100%", height: "300px" }}
          />
        </Box>
        <Box gridColumn="span 6" bgcolor="#1e1e2f" p="20px">
          <Typography variant="h5" fontWeight="600" color="#ffffff" mb={2}>
            Candidates by Degree
          </Typography>
          <Plot
            data={[{
              type: 'pie',
              values: [50, 30, 10, 10],
              labels: ['Bachelors', 'Masters', 'Diploma', 'Other'],
              textinfo: "label+percent",
              marker: { colors: ['#ffb74d', '#4db6ac', '#7986cb', '#90a4ae'] }
            }]}
            layout={{
              autosize: true,
              paper_bgcolor: "#1e1e2f",
              font: { color: "#ffffff" },
              margin: { t: 0, b: 0 },
              legend: {
                x: -0.1,
                y: 0.5,
                xanchor: 'right',
                orientation: 'v',
                font: { color: "#ffffff" },
              },
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
            data={[{
              type: 'bar',
              x: [40, 35, 30, 25, 15],
              y: ['JavaScript', 'Python', 'React', 'Java', 'SQL'],
              orientation: 'h',
              marker: { color: "#81c784" },
            }]}
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
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;
