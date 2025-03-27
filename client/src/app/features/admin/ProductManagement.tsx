import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CardMedia,
  Paper,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import agent from "../../api/agent";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  productBrand: string;
  productType: string;
}

const initialProductState: Product = {
  id: 0,
  name: "",
  description: "",
  price: 0,
  pictureUrl: "",
  productBrand: "",
  productType: "",
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product>(initialProductState);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchTypes();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await agent.Store.list(1, 20); // Adjust page/size as needed
      setProducts(data.content || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const data = await agent.Store.brands();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const data = await agent.Store.types();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(initialProductState);
    setIsEditing(false);
    setImageFile(null);
    setOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await agent.Store.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const updatedProduct = { ...editingProduct };

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch("http://localhost:8081/api/products/uploadImage", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Image upload failed: ${errorText}`);
        }

        const imageUrl = await response.text();
        updatedProduct.pictureUrl = imageUrl;
      }

      if (isEditing) {
        await agent.Store.updateProduct(editingProduct.id, updatedProduct);
      } else {
        await agent.Store.createProduct(updatedProduct);
      }

      fetchProducts();
      setOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save the product. Please try again.");
    }
  };

  const extractImageName = (item: Product): string | null => {
    if (item && item.pictureUrl) {
      const parts = item.pictureUrl.split("/");
      return parts[parts.length - 1];
    }
    return null;
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddProduct}>
        Add Product
      </Button>
      <TextField
        fullWidth
        label="Search Products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginTop: 2, marginBottom: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  <CardMedia
                    sx={{ height: 140, backgroundSize: "contain" }}
                    image={`/images/products/${extractImageName(product)}`}
                    title={product.name}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.productBrand}</TableCell>
                <TableCell>{product.productType}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleEditProduct(product)}>
                    <Edit />
                  </Button>
                  <Button onClick={() => handleDeleteProduct(product.id)}>
                    <Delete color="error" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding/editing products */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, price: +e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={editingProduct.productBrand}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, productBrand: e.target.value })
                }
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.name}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={editingProduct.productType}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, productType: e.target.value })
                }
              >
                {types.map((type) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="file"
                inputProps={{ accept: "image/*" }}
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0] || null;
                  setImageFile(file);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveProduct} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
