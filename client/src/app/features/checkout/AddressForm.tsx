import { Grid, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

export default function AddressForm() {
    const { register, formState: { errors } } = useFormContext();
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Lieferadresse
            </Typography>
            <form>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="firstName"
                            {...register("firstName")}
                            label="Vorname"
                            fullWidth
                            helperText="Geben Sie den Vornamen ein"
                            autoComplete="given-name"
                            variant="standard"
                            error={!!errors.firstName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="lastName"
                            {...register("lastName")}
                            label="Nachname"
                            helperText="Geben Sie den Nachnamen ein"
                            fullWidth
                            autoComplete="family-name"
                            variant="standard"
                            error={!!errors.lastName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="address1"
                            {...register("address1")}
                            label="Adresszeile 1"
                            helperText="Geben Sie die Adresszeile 1 ein"
                            fullWidth
                            autoComplete="shipping address-line1"
                            variant="standard"
                            error={!!errors.address1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="address2"
                            {...register("address2")}
                            label="Adresszeile 2"
                            helperText="Geben Sie die Adresszeile 2 ein"
                            fullWidth
                            autoComplete="shipping address-line2"
                            variant="standard"
                            error={!!errors.address2}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="city"
                            {...register("city")}
                            label="Stadt"
                            helperText="Geben Sie die Stadt ein"
                            fullWidth
                            autoComplete="shipping address-level2"
                            variant="standard"
                            error={!!errors.city}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="state"
                            {...register("state")}
                            label="Bundesland/Provinz/Region"
                            helperText="Geben Sie das Bundesland ein"
                            fullWidth
                            variant="standard"
                            error={!!errors.state}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="zip"
                            {...register("zip")}
                            label="PLZ / Postleitzahl"
                            helperText="Geben Sie die Postleitzahl ein"
                            fullWidth
                            autoComplete="shipping postal-code"
                            variant="standard"
                            error={!!errors.zip}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="country"
                            {...register("country")}
                            label="Land"
                            helperText="Geben Sie das Land ein"
                            fullWidth
                            autoComplete="shipping country"
                            variant="standard"
                            error={!!errors.country}
                        />
                    </Grid>
                </Grid>
            </form>
        </>
    );
}
