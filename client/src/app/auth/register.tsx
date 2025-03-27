import { Container, Paper, Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleRegister = () => {
        if (password !== confirmPassword) {
            setError("Passwörter stimmen nicht überein.");
            return;
        }

        if (email && password && confirmPassword) {
            // Simulate successful registration
            setSuccess(true);
            setError('');
            setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
        } else {
            setError("Bitte füllen Sie alle Felder aus.");
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
                Registrieren
            </Typography>
            {error && (
                <Typography variant="body2" color="error" gutterBottom>
                    {error}
                </Typography>
            )}
            {success && (
                <Typography variant="body2" color="success.main" gutterBottom>
                    Registrierung erfolgreich! Sie werden weitergeleitet...
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
                <TextField
                    label="Passwort bestätigen"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleRegister}
                >
                    Registrieren
                </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
                Bereits ein Konto? <Button onClick={() => navigate('/login')} color="secondary">Anmelden</Button>
            </Typography>
        </Container>
    );
}
