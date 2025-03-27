import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box, Button} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import { Add, Remove } from "@mui/icons-material";
import { Product } from "../../models/product";
import { useAppDispatch, useAppSelector } from "../../store/configureStors";
import agent from "../../api/agent";
import BasketSummary from "./BasketSummary";
import { Link, useNavigate } from "react-router-dom";

export default function BasketPage(){
    const {basket} = useAppSelector(state=>state.basket);
    const dispatch = useAppDispatch();
    const navigate = useNavigate(); 
    const {Basket: BasketActions} = agent;

    const removeItem = (productId: number)=>{
        BasketActions.removeItem(productId, dispatch);
    };

    const decrementItem = (productId: number, quantity: number = 1)=>{
        BasketActions.decrementItemQuantity(productId, quantity, dispatch);
    };
    const incrementItem = (productId: number, quantity: number = 1)=>{
        BasketActions.incrementItemQuantity(productId, quantity, dispatch);
    };
    // Define the extractImageName function
    const extractImageName = (item: Product): string | null => {
        if (item && item.pictureUrl) {
            const parts = item.pictureUrl.split('/');
            if (parts.length > 0) {
                return parts[parts.length - 1];
            }
        }
        return null;
    };

    // Function to format the price with INR currency symbol
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2
        }).format(price);
      }
      if (!basket || basket.items.length === 0) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ marginTop: 6, gap: 2 }}
            >
                <ShoppingCartOutlinedIcon sx={{ fontSize: 100, color: "gray" }} />
                <Typography
                    variant="h3"
                    align="center"
                    sx={{ fontWeight: "bold", color: "gray" }}
                >
                    Ihr Warenkorb ist leer
                </Typography>
                <Typography
                    variant="body1"
                    align="center"
                    sx={{ color: "gray", marginBottom: 2 }}
                >
                    Bitte fügen Sie ein paar Artikel hinzu, um fortzufahren.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate("/store")} // Use navigate function
                    sx={{ textTransform: "none" }}
                >
                    Jetzt einkaufen
                </Button>
            </Box>
        );
    }
    return (
        <>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Image</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {basket.items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                {item.pictureUrl && (
                                    <img src={"/images/products/"+extractImageName(item)} alt="Product" width="50" height="50" />
                                )}
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{formatPrice(item.price)}</TableCell>
                            <TableCell>
                                <IconButton color='error' onClick={() => decrementItem(item.id)}>
                                    <Remove />
                                </IconButton>
                                {item.quantity}
                                <IconButton color='error' onClick={() => incrementItem(item.id)}>
                                    <Add />
                                </IconButton>
                            </TableCell>
                            <TableCell>{formatPrice(item.price * item.quantity)}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => removeItem(item.id)} aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Box mt={2} p={2} bgcolor="background.paper" borderRadius={4}>
            <BasketSummary/>
            <Button
                component={Link}
                to='/checkout'
                variant='contained'
                size='large'
                fullWidth
            >
                Checkout
            </Button>
        </Box>
        </>
    );
    
}