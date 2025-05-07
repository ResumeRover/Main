import { Typography, Box } from "@mui/material";

const Header = ({ title, subtitle }) => {
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        fontWeight="bold"
        sx={{ color: "#e0e0e0", m: "0 0 5px 0" }} // light gray for title
      >
        {title}
      </Typography>
      <Typography variant="h5" sx={{ color: "#66bb6a" }}> {/* green for subtitle */}
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
