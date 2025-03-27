import React, { useEffect, useState } from "react";
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    TextField,
} from "@mui/material";
import Spinner from "../../layout/Spinner"; // Spinner component for loading
import agent from "../../api/agent"; // API service
import type { Order } from "../../models/order"; // Order type

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // Search input state

    useEffect(() => {
        fetchOrders();
    }, []);

    // Fetch orders from the backend
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const fetchedOrders = await agent.Orders.list();
            setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Filter orders based on the search term
    const filteredOrders = orders?.filter((order) => {
        const searchValue = searchTerm.toLowerCase();
        return (
            order.basketId.toLowerCase().includes(searchValue) ||
            order.shippingAddress.name.toLowerCase().includes(searchValue) ||
            order.shippingAddress.city.toLowerCase().includes(searchValue) ||
            order.orderStatus.toLowerCase().includes(searchValue) ||
            order.id.toString().includes(searchValue)
        );
    });

    if (loading) return <Spinner message="Loading orders..." />;

    if (!orders || orders.length === 0) {
        return (
            <Typography variant="h3" align="center" sx={{ marginTop: 4 }}>
                No orders found.
            </Typography>
        );
    }

    return (
        <>
            <TextField
                label="Search Orders"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={handleSearchChange}
                value={searchTerm}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1200 }} aria-label="Orders Table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                          
                            <TableCell>Shipping Name</TableCell>
                            <TableCell>Address Line 1</TableCell>
                            <TableCell>Address Line 2</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>State</TableCell>
                            
                            <TableCell>Country</TableCell>
                          
                            <TableCell>Order Status</TableCell>
                            <TableCell align="right">Subtotal (€)</TableCell>
                            <TableCell align="right">Delivery Fee (€)</TableCell>
                            <TableCell align="right">Total (€)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders?.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                              
                                <TableCell>{order.shippingAddress.name}</TableCell>
                                <TableCell>{order.shippingAddress.address1}</TableCell>
                                <TableCell>{order.shippingAddress.address2}</TableCell>
                                <TableCell>{order.shippingAddress.city}</TableCell>
                                <TableCell>{order.shippingAddress.state}</TableCell>
                              
                                <TableCell>{order.shippingAddress.country}</TableCell>
                               
                                <TableCell>{order.orderStatus}</TableCell>
                                <TableCell align="right">{order.subTotal.toFixed(2)}</TableCell>
                                <TableCell align="right">{order.deliveryFee.toFixed(2)}</TableCell>
                                <TableCell align="right">{order.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
