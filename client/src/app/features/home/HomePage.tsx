import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/store"); // Adjust this path based on your routing setup
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "linear-gradient(to right, #2193b0, #6dd5ed)", // Gradient background
        color: "#fff",
        padding: 4,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
        Willkommen zu unserem Online-Marktplatz
      </Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Entdecken Sie die besten Produkte zu unschlagbaren Preisen!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{
          fontSize: "1.2rem",
          padding: "10px 20px",
          borderRadius: "20px",
          boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)", // Adds a slight zoom effect on hover
          },
        }}
        onClick={handleShopNow}
      >
        Jetzt shoppen
      </Button>
    </Box>
  );
}
