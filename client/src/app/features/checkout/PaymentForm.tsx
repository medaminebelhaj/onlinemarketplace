import { Checkbox, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

export default function PaymentForm() {
    const { register, formState: { errors } } = useFormContext();
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Zahlungsformular
            </Typography>
            <form>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="cardName"
                            {...register("cardName")}
                            label="Name auf der Karte"
                            helperText="Geben Sie den Namen auf der Karte ein"
                            fullWidth
                            autoComplete="cc-name"
                            variant="standard"
                            error={!!errors.cardName}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="cardNumber"
                            {...register("cardNumber")}
                            label="Kartennummer"
                            helperText="Geben Sie die Kartennummer ein"
                            fullWidth
                            autoComplete="cc-number"
                            variant="standard"
                            error={!!errors.cardNumber}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="expDate"
                            {...register("expDate")}
                            label="Ablaufdatum"
                            helperText="Geben Sie das Ablaufdatum ein"
                            fullWidth
                            autoComplete="cc-exp"
                            variant="standard"
                            error={!!errors.expDate}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="cvv"
                            {...register("cvv")}
                            label="CVV"
                            helperText="Die letzten drei Ziffern auf dem Unterschriftsstreifen"
                            fullWidth
                            autoComplete="cc-csc"
                            variant="standard"
                            error={!!errors.cvv}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
                            label="Kreditkartendaten für das nächste Mal speichern"
                        />
                    </Grid>
                </Grid>
            </form>
        </>
    );
}
