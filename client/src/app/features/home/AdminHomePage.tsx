import { Box, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminHomePage() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
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
        background: "linear-gradient(to right, #FF512F, #DD2476)", // Gradient background
        color: "#fff",
        padding: 4,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
        Willkommen, Admin!
      </Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Verwalten Sie Ihr Online-Marktplatz einfach und effektiv.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item>
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
                transform: "scale(1.05)",
              },
            }}
            onClick={() => handleNavigation("/users")}
          >
            Benutzerverwaltung
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              fontSize: "1.2rem",
              padding: "10px 20px",
              borderRadius: "20px",
              boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={() => handleNavigation("/products")}
          >
            Produktverwaltung
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            sx={{
              fontSize: "1.2rem",
              padding: "10px 20px",
              borderRadius: "20px",
              boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={() => handleNavigation("/types")}
          >
            Typverwaltung
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="warning"
            sx={{
              fontSize: "1.2rem",
              padding: "10px 20px",
              borderRadius: "20px",
              boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={() => handleNavigation("/brands")}
          >
            Markenverwaltung
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
