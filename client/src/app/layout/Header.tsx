import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Home,
  Store,
  People,
  Inventory,
  Category,
  BrandingWatermark,
  ShoppingCart,
  Login,
  AppRegistration,
} from "@mui/icons-material";
import { useAppSelector } from "../store/configureStors";
import SignedInMenu from "./SignedInMenu";
import { NavLink } from "react-router-dom";

const navLinks = [
  { title: "Home", path: "/", icon: <Home /> },
  { title: "Store", path: "/store", icon: <Store /> },
];

const adminLinks = [
  { title: "Users", path: "/users", icon: <People /> },
  { title: "Products", path: "/products", icon: <Inventory /> },
  { title: "Types", path: "/types", icon: <Category /> },
  { title: "Brands", path: "/brands", icon: <BrandingWatermark /> },
  { title: "Orders", path: "/ordersman", icon: <ShoppingCart /> },
];

const accountLinks = [
  { title: "Login", path: "/login", icon: <Login /> },
  { title: "Register", path: "/register", icon: <AppRegistration /> },
];

const navStyles = {
  color: "inherit",
  typography: "h6",
  textDecoration: "none",
  padding: "0.3rem 0.8rem",
  borderRadius: "0.3rem",
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
  transition: "background-color 0.3s ease, transform 0.3s ease",
  fontSize: "0.9rem",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: "scale(1.05)",
  },
  "&:active": {
    backgroundColor: "secondary.light",
    transform: "scale(1.02)",
  },
};

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

export default function Header({ darkMode, handleThemeChange }: Props) {
  const { basket } = useAppSelector((state) => state.basket);
  const { user } = useAppSelector((state) => state.account);

  const itemCount = basket?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo and Theme Switch */}
        <Box display="flex" alignItems="center">
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              letterSpacing: "1.5px",
              color: "white",
            }}
          >
            Online Marketplace
          </Typography>
          {user?.role === "admin" && (
            <Typography
              variant="subtitle2"
              sx={{
                color: "white",
                ml: 1,
              }}
            >
              Admin Platform
            </Typography>
          )}
          <Switch checked={darkMode} onChange={handleThemeChange} sx={{ ml: 2 }} />
        </Box>

        {/* Navigation Links */}
        <List sx={{ display: "flex" }}>
          {navLinks.map(({ title, path, icon }) => (
            <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
              {icon}
              {title}
            </ListItem>
          ))}

          {user?.role === "admin" &&
            adminLinks.map(({ title, path, icon }) => (
              <ListItem
                component={NavLink}
                to={path}
                key={path}
                sx={{
                  ...navStyles,
                  fontWeight: "bold",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#FFD700",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                {icon}
                {title}
              </ListItem>
            ))}
        </List>

        {/* User Account Section */}
        <Box display="flex" alignItems="center">
          {/* Hide Basket for Admin */}
          {user?.role !== "admin" && (
            <Tooltip title="View Basket">
              <IconButton
                component={NavLink}
                to="/basket"
                size="large"
                edge="start"
                color="inherit"
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={itemCount} color="secondary">
                  🛒
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* Show Signed-in Menu or Account Links */}
          {user ? (
            <SignedInMenu user={user} />
          ) : (
            <List sx={{ display: "flex" }}>
              {accountLinks.map(({ title, path, icon }) => (
                <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                  {icon}
                  {title}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
