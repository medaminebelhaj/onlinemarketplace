import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import agent from "../../api/agent";
import { toast } from "react-toastify";
interface User {
    id: number;
    username: string;
    email: string;
    password?: string; // Add password field
    role: string;
}

const initialUserState: User = {
    id: 0,
    username: "",
    email: "",
    password: "", // Initialize password
    role: "USER",
};

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User>(initialUserState);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await agent.Admin.listUsers();
            setUsers(data);
            toast.success("Users fetched successfully!");
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users.");
        }
    };

    const handleAddUser = () => {
        setEditingUser(initialUserState);
        setIsEditing(false);
        setOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser({ ...user, password: "" }); // Don't include password in edit
        setIsEditing(true);
        setOpen(true);
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await agent.Admin.deleteUser(id);
            fetchUsers();
            toast.success("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        }
    };

    const handleSaveUser = async () => {
        try {
            if (isEditing) {
                await agent.Admin.updateUser(editingUser.id, editingUser);
                toast.success("User updated successfully!");
            } else {
                await agent.Admin.createUser(editingUser);
                toast.success("User added successfully!");
            }
            fetchUsers();
            setOpen(false);
        } catch (error) {
            console.error("Error saving user:", error);
            toast.error("Failed to save user.");
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAddUser}>
                Add User
            </Button>
            <TableContainer sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEditUser(user)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteUser(user.id)}>
                                        <Delete color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Add/Edit User */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={editingUser.username}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, username: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={editingUser.email}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, email: e.target.value })
                                }
                            />
                        </Grid>
                        {!isEditing && ( // Only show password for adding a new user
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={editingUser.password}
                                    onChange={(e) =>
                                        setEditingUser({ ...editingUser, password: e.target.value })
                                    }
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Select
                                fullWidth
                                value={editingUser.role}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, role: e.target.value })
                                }
                            >
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveUser} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}