import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

import BasketSummary from "../basket/BasketSummary";
import { useAppSelector } from "../../store/configureStors";
import { Product } from "../../models/product";

export default function Review() {
    const { basket } = useAppSelector(state => state.basket);
    // Funktion zur Extraktion des Bildnamens definieren
    const extractImageName = (item: Product): string | null => {
        if (item && item.pictureUrl) {
            const parts = item.pictureUrl.split('/');
            if (parts.length > 0) {
                return parts[parts.length - 1];
            }
        }
        return null;
    };

    // Funktion zur Formatierung des Preises mit dem EUR-Währungssymbol
    const formatPrice = (price: number): string => {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      }).format(price);
    };
  
    return (
        <>
      <Typography variant="h6" gutterBottom>
        Bestellübersicht
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produktbild</TableCell>
              <TableCell>Produkt</TableCell>
              <TableCell>Preis</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket?.items.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.pictureUrl && (
                    <img src={"/images/products/"+extractImageName(product)} alt="Produkt" width="50" height="50" />
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
              </TableRow>
            ))}            
          </TableBody>
        </Table>
      </TableContainer>
      <BasketSummary />
    </>
    )
}
