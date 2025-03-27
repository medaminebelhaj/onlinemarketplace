import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import agent from "../../api/agent";
  import Spinner from "../../layout/Spinner";
  import type { Order } from "../../models/order";
  
  export default function Order() {
    // Erlaubt null für den Ladezustand
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Für Weiterleitungen
  
    useEffect(() => {
      const userId = localStorage.getItem("userId");
  
      if (!userId) {
        console.error("Benutzer-ID nicht im localStorage gefunden.");
        setOrders([]); // Fallback auf ein leeres Array
        setLoading(false);
        return;
      }
  
      const basketId = `basket-${userId}`;
  
      agent.Orders.fetchByBasketId(basketId)
        .then((fetchedOrders) => {
          if (Array.isArray(fetchedOrders)) {
            setOrders(fetchedOrders);
          } else {
            console.error("Ungültiges Datenformat empfangen.");
            setOrders([]);
          }
        })
        .catch((error) => {
          console.error("Fehler beim Abrufen der Bestellungen:", error.message);
          setOrders([]);
        })
        .finally(() => setLoading(false));
    }, []);
  
    useEffect(() => {
      // Wenn nicht mehr geladen wird und keine Bestellungen vorhanden sind,
      // weiterleiten auf die Fehlerseite
      if (!loading && orders?.length === 0) {
        navigate("/ordererrorpage");
      }
    }, [loading, orders, navigate]);
  
    if (loading) return <Spinner message="Bestellungen werden geladen..." />;
  
    if (!orders || orders.length === 0) {
      return (
        <Typography variant="h3" align="center" sx={{ marginTop: 4 }}>
          Sie haben keine Bestellungen. Bitte fügen Sie Artikel hinzu und bestellen Sie!
        </Typography>
      );
    }
  
    // Hilfsfunktion zum Formatieren des Bestelldatums
    function formatDate(orderDateArray: any) {
      if (!Array.isArray(orderDateArray) || orderDateArray.length < 3) {
        return "Ungültiges Datum";
      }
      const [year, month, day] = orderDateArray;
      return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    }
  
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Bestellungstabelle">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="right">Summe</TableCell>
              <TableCell align="right">Bestelldatum</TableCell>
              <TableCell align="right">Bestellstatus</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {order.id}
                </TableCell>
                <TableCell align="right">{order.total}</TableCell>
                <TableCell align="right">{formatDate(order.orderDate)}</TableCell>
                <TableCell align="right">{order.orderStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  