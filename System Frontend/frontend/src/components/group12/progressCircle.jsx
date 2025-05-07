import { Box } from "@mui/material";

const ProgressCircle = ({ progress = 0.75, size = 40 }) => {
  const angle = progress * 360;

  return (
    <Box
      sx={{
        background: `radial-gradient(#1e1e2f 55%, transparent 56%),
          conic-gradient(transparent 0deg ${angle}deg, #2196f3 ${angle}deg 360deg),
          #66bb6a`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;
