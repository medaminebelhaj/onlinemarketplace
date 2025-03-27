import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";
import { ValidationRules } from "./validationRules";
import { useAppDispatch } from "../../store/configureStors";
import agent from "../../api/agent";
import { BasketItem } from "../../models/basket";

const steps = ["Lieferadresse", "Bestellung prüfen", "Zahlungsdetails"];

function getStepContent(step: number) {
  switch (step) {
      case 0:
          return <AddressForm />;
      case 1:
          return <Review />;
      case 2:
          return <PaymentForm />;
      default:
          throw new Error("Unbekannter Schritt");
  }
}

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const currentValdationRule = ValidationRules[activeStep];
  const methods = useForm({
      mode: "all",
      resolver: yupResolver(currentValdationRule),
  }); // Initialize useForm
  const dispatch = useAppDispatch();

  const handleNext = async () => {
      const isValid = await methods.trigger();

      if (isValid) {
          const data: any = methods.getValues();
          console.log(data);

          if (activeStep === steps.length - 1) {
              const basket = await agent.Basket.get();
              if (basket) {
                  const subTotal = calculateSubTotal(basket.items);

                  const deliveryFee = 5;

                  try {
                      setLoading(true);

                      const orderDto = {
                          basketId: basket.id,
                          shippingAddress: {
                              name: data.firstName + " " + data.lastName,
                              address1: data.address1,
                              address2: data.address2,
                              city: data.city,
                              state: data.state,
                              zipCode: data.zip,
                              country: data.country,
                          },
                          subTotal: subTotal,
                          deliveryFee: deliveryFee,
                      };

                      const orderId = await agent.Orders.create(orderDto);
                      setOrderNumber(orderId);
                      setActiveStep(activeStep + 1);

                      agent.Basket.deleteBasket(basket.id);
                      dispatch(setBasket(null));
                      localStorage.removeItem("basket_id");
                      localStorage.removeItem("basket");
                  } catch (error) {
                      console.error("Fehler beim Absenden der Bestellung:", error);
                      toast.error(
                          "Fehler beim Absenden der Bestellung. Bitte versuchen Sie es erneut."
                      );
                  } finally {
                      setLoading(false);
                  }
              } else {
                  console.error("Warenkorb nicht im lokalen Speicher gefunden.");
              }
          } else {
              setActiveStep(activeStep + 1);
          }
      }
  };

  const handleBack = () => {
      setActiveStep(activeStep - 1);
  };

  const calculateSubTotal = (items: BasketItem[]): number => {
      return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
      );
  };

  return (
      <FormProvider {...methods}>
          <Paper
              variant="outlined"
              sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
              <Typography component="h1" variant="h4" align="center">
                  Kasse
              </Typography>
              <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                  {steps.map((label) => (
                      <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                      </Step>
                  ))}
              </Stepper>
              <>
                  {activeStep === steps.length ? (
                      <>
                          <Typography variant="h5" gutterBottom>
                              Vielen Dank für Ihre Bestellung.
                          </Typography>
                          <Typography variant="subtitle1">
                              Ihre Bestellnummer lautet #{orderNumber}. Wir haben Ihre
                              Bestellbestätigung per E-Mail gesendet und informieren Sie,
                              sobald Ihre Bestellung versandt wurde.
                          </Typography>
                      </>
                  ) : (
                      <>
                          {getStepContent(activeStep)}
                          <Box
                              sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                              {activeStep !== 0 && (
                                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                      Zurück
                                  </Button>
                              )}
                              <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  sx={{ mt: 3, ml: 1 }}
                              >
                                  {activeStep === steps.length - 1
                                      ? "Bestellung abschicken"
                                      : "Weiter"}
                              </Button>
                          </Box>
                      </>
                  )}
              </>
          </Paper>
      </FormProvider>
  );
}
