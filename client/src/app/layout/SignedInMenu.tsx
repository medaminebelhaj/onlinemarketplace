import { Menu, MenuItem, Typography, IconButton, Avatar, Box } from "@mui/material";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/configureStors";
import { logOut, logoutUser } from "../features/account/accountSlice";

interface Props {
  user: { username: string };
}

export default function SignedInMenu({ user }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Abmeldung eingeleitet");
    try {
      dispatch(logOut());
      dispatch(logoutUser());
      console.log("Abmeldeaktion ausgeführt.");
      navigate("/login");
      console.log("Zur Login-Seite navigiert.");
    } catch (error) {
      console.error("Fehler bei der Abmeldung:", error);
    } finally {
      handleMenuClose();
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Profil-Icon und Benutzername */}
      <IconButton
        onClick={handleMenuOpen}
        size="large"
        edge="end"
        color="inherit"
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "6px 12px",
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          borderRadius: "50px",
          transition: "all 0.3s",
          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
        }}
      >
        <Avatar sx={{ bgcolor: "secondary.main", marginRight: 1, width: 30, height: 30 }}>
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "500",
            color: "inherit",
            display: { xs: "none", sm: "block" },
          }}
        >
          {user.username}
        </Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Typography variant="subtitle1" sx={{ color: "text.primary" }}>
            Profil
          </Typography>
        </MenuItem>
        <MenuItem component={Link} to="/orders">Meine Bestellungen</MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography variant="subtitle1" sx={{ color: "text.primary" }}>
            Abmelden
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
