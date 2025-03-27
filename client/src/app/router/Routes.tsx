import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../features/home/HomePage";
import Catalog from "../features/catalog/Catalog";
import ContactPage from "../features/contact/ContactPage";
import ProductDetails from "../features/catalog/ProductDetails";
import NotFound from "../errors/NotFoundError";
import ServerError from "../errors/ServerError";
import BasketPage from "../features/basket/BasketPage";
import SignInPage from "../features/account/SignInPage";
import RegisterPage from "../features/account/RegisterPage";
import RequireAuth from "./RequireAuth";
import AdminRoute from "./AdminRoute";
import CheckoutPage from "../features/checkout/CheckoutPage";
import Order from "../features/orders/Order";
import UserManagement from "../features/admin/UserManagement";
import ProductManagement from "../features/admin/ProductManagement";
import TypeManagement from "../features/admin/TypeManagement";
import BrandManagement from "../features/admin/BrandManagement";
import OrderManagement from "../features/admin/ordermanagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: "checkout", element: <CheckoutPage /> },
          { path: "orders", element: <Order /> },
        ],
      },
      { path: "", element: <HomePage /> },
      { path: "store", element: <Catalog /> },
      { path: "store/:id", element: <ProductDetails /> },
      { path: "contact", element: <ContactPage /> },
      { path: "basket", element: <BasketPage /> },
      { path: "login", element: <SignInPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "not-found", element: <NotFound /> },
      { path: "server-error", element: <ServerError /> },
      // Admin routes wrapped with AdminRoute
      {
        path: "users",
        element: (
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        ),
      },
      {
        path: "products",
        element: (
          <AdminRoute>
            <ProductManagement />
          </AdminRoute>
        ),
      },
      {
        path: "types",
        element: (
          <AdminRoute>
            <TypeManagement />
          </AdminRoute>
        ),
      },
      {
        path: "brands",
        element: (
          <AdminRoute>
            <BrandManagement />
          </AdminRoute>
        ),
      },
      {
        path: "ordersman",
        element: (
          <AdminRoute>
            <OrderManagement />
          </AdminRoute>
        ),
      },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
