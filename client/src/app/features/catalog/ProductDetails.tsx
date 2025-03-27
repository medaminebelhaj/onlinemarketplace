import {
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
    TextField,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import { Product } from "../../models/product";
  import agent from "../../api/agent";
  import NotFound from "../../errors/NotFoundError";
  import Spinner from "../../layout/Spinner";
  import { LoadingButton } from "@mui/lab";
  import { useAppDispatch, useAppSelector } from "../../store/configureStors";
  
  export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>();
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [submitting, setSubmitting] = useState(false);
  
    const dispatch = useAppDispatch();
    const { basket } = useAppSelector((state) => state.basket);
  
    const item = basket?.items.find(i=> i.id === product?.id);
  
    useEffect(() => {
      if (item) setQuantity(item.quantity);
    }, [item]);
  
    const extractImageName = (item: Product): string | null => {
      if (item && item.pictureUrl) {
        const parts = item.pictureUrl.split("/");
        return parts.length > 0 ? parts[parts.length - 1] : null;
      }
      return null;
    };
  
    const formatPrice = (price: number): string => {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      }).format(price);
    };
  
    const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value);
      if (!isNaN(value) && value > 0) {
        setQuantity(value);
      }
    };
  
    const updateQuantity = async () => {
      try {
        setSubmitting(true);
        const newItem = {
          ...product!,
          quantity: quantity,
        };
        if (item) {
          const quantityDifference = quantity - item.quantity;
          if (quantityDifference > 0) {
            await agent.Basket.incrementItemQuantity(item.id, quantityDifference, dispatch);
          } else if (quantityDifference < 0) {
            await agent.Basket.decrementItemQuantity(item.id, Math.abs(quantityDifference), dispatch);
          }
        } else {
          await agent.Basket.addItem(newItem, dispatch);
        }
        setSubmitting(false);
      } catch (error) {
        console.error("Failed to update quantity:", error);
        setSubmitting(false);
      }
    };
  
    useEffect(() => {
      id &&
        agent.Store.details(parseInt(id))
          .then((response) => setProduct(response))
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
    }, [id]);
  
    if (loading) return <Spinner message="Loading Products ..." />;
    if (!product) return <NotFound />;
  
    return (
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <img
            src={"/images/products/" + extractImageName(product)}
            alt={product.name}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h3">{product.name}</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography gutterBottom color="secondary" variant="h4">
            {formatPrice(product.price)}
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{product.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{product.productType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>{product.productBrand}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                onChange={inputChange}
                variant="outlined"
                type="number"
                label="Quantity in Cart"
                fullWidth
                value={quantity}
              />
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                sx={{ height: "55px" }}
                color="primary"
                size="large"
                variant="contained"
                fullWidth
                loading={submitting}
                onClick={updateQuantity}
              >
                {item ? "Update Quantity" : "Add to Cart"}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
  