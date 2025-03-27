import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

interface Brand {
  id: number;
  name: string;
}

const initialBrandState: Brand = {
  id: 0,
  name: "",
};

export default function BrandManagement() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [open, setOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand>(initialBrandState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/products/brands");
      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleAddBrand = () => {
    setEditingBrand(initialBrandState);
    setIsEditing(false);
    setOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteBrand = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/products/brands/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete brand");
      }
      fetchBrands();
      console.log("Brand deleted successfully.");
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  const handleSaveBrand = async () => {
    try {
      const url = isEditing
        ? `http://localhost:8081/api/products/brands/${editingBrand.id}`
        : "http://localhost:8081/api/products/brands";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingBrand),
      });

      if (!response.ok) {
        throw new Error("Failed to save brand");
      }

      fetchBrands();
      setOpen(false);
      console.log("Brand saved successfully.");
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Brand Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddBrand}>
        Add Brand
      </Button>
      <TableContainer sx={{ marginTop: 2 }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.id}</TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleEditBrand(brand)}>
                    <Edit />
                  </Button>
                  <Button onClick={() => handleDeleteBrand(brand.id)}>
                    <Delete color="error" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit Brand" : "Add Brand"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={editingBrand.name}
                onChange={(e) =>
                  setEditingBrand({ ...editingBrand, name: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveBrand} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
