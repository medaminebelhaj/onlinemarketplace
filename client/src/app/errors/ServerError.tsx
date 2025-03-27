import { Container, Paper, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ServerError(){
    const navigate = useNavigate();
    const handleGoHome = () =>{
        navigate('/');
    }
    return (
        <Container component={Paper} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
           
            <Typography variant="h4" component="h1" gutterBottom>
            Huch! Etwas ist schief gelaufen.
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
            Der Server ist auf einen internen Fehler gestoßen und war nicht in der Lage, Ihre Anfrage zu bearbeiten.
            </Typography>
            
            <Button variant="contained" color="primary" onClick={handleGoHome}>
                Go Home
            </Button>
        </Container>
    )
}