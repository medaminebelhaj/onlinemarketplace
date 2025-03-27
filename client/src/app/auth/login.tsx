import { Container, Paper, Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        // Dummy login logic
        if (email === "test@example.com" && password === "password123") {
            navigate('/'); // Navigate to home page after successful login
        } else {
            setError("Ungültige Anmeldedaten. Bitte versuchen Sie es erneut."); // Error message
        }
    };

    return (
        <Container
            component={Paper}
            sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: 400,
                margin: 'auto',
                mt: 8,
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Anmelden
            </Typography>
            {error && (
                <Typography variant="body2" color="error" gutterBottom>
                    {error}
                </Typography>
            )}
            <Box component="form" sx={{ width: '100%', mt: 2 }}>
                <TextField
                    label="E-Mail"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Passwort"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                >
                    Anmelden
                </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
                Noch kein Konto? <Button onClick={() => navigate('/register')} color="secondary">Registrieren</Button>
            </Typography>
        </Container>
    );
}
