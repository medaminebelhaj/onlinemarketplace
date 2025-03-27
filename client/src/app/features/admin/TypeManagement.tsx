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

interface Type {
  id: number;
  name: string;
}

const initialTypeState: Type = {
  id: 0,
  name: "",
};

export default function TypeManagement() {
  const [types, setTypes] = useState<Type[]>([]);
  const [open, setOpen] = useState(false);
  const [editingType, setEditingType] = useState<Type>(initialTypeState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/products/types");
      if (!response.ok) {
        throw new Error("Failed to fetch types");
      }
      const data = await response.json();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const handleAddType = () => {
    setEditingType(initialTypeState);
    setIsEditing(false);
    setOpen(true);
  };

  const handleEditType = (type: Type) => {
    setEditingType(type);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteType = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/products/types/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete type");
      }
      fetchTypes();
      console.log("Type deleted successfully.");
    } catch (error) {
      console.error("Error deleting type:", error);
    }
  };

  const handleSaveType = async () => {
    try {
      const url = isEditing
        ? `http://localhost:8081/api/products/types/${editingType.id}`
        : "http://localhost:8081/api/products/types";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingType),
      });

      if (!response.ok) {
        throw new Error("Failed to save type");
      }

      fetchTypes();
      setOpen(false);
      console.log("Type saved successfully.");
    } catch (error) {
      console.error("Error saving type:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Type Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddType}>
        Add Type
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
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.id}</TableCell>
                <TableCell>{type.name}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleEditType(type)}>
                    <Edit />
                  </Button>
                  <Button onClick={() => handleDeleteType(type.id)}>
                    <Delete color="error" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit Type" : "Add Type"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={editingType.name}
                onChange={(e) =>
                  setEditingType({ ...editingType, name: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveType} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
