import { createBrowserRouter } from "react-router-dom"
import Userlayout from "../layout/Userlayout";
import Login from "../auth/Login";
import Register from "../auth/Register";

import Profile from "../auth/Profile";


// admin

import AdminLogin from "./AdminLogin.jsx";
import Adminlayout from "../layout/Adminlayout";
import Orders from "../pages/admin/Orders";
import Setting from "../pages/admin/Setting";
import AdminProducts from '../pages/admin/product/AdminProducts';
import AddProduct from "../pages/admin/product/AddProduct";
import EditProduct from "../pages/admin/product/EditProduct";
import ProtectedRoute from "./protectedRoute";
import UserProtectedRoute from "./UserProtectedRoute";

import ResetPassword from "./ResetPassword.jsx";
import AdminResetPassword from '../auth/AdminResetPassword.jsx';
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import Home from './../pages/client/Home';
import Categories from "../pages/client/Categories.jsx";
import Products from './../pages/client/Products';
import Customers from './../pages/admin/Customers';
import Card from './../components/common/Card';
import Checkout from "../pages/client/Checkout.jsx";
import MyOrders from "../components/common/MyOrder.jsx";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: Userlayout,
    children: [
      { index: true, Component: Home },
      { path: "categories", Component: Categories },
      { path: "products", Component: Products },
      { path: "card", Component: Card },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "checkout", Component: Checkout },
      { path: "orders", Component: MyOrders },
      { path: "reset-password/:token", Component: ResetPassword },
      {
        path: "profile",
        Component: UserProtectedRoute,
        children: [{ index: true, Component: Profile }],
      },
    ],
  },

  // admin route

  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: ProtectedRoute,
    children: [
      {
        Component: Adminlayout,
        children: [
          { index: true, Component: AdminDashboard },

          // products CRUD
          { path: "products", Component: AdminProducts },
          { path: "card", Component: Card },
          { path: "products/add", Component: AddProduct },
          { path: "products/edit/:id", Component: EditProduct },

          // other admin pages
          { path: "orders", Component: Orders },
          { path: "customers", Component: Customers },
          { path: "setting", Component: Setting },
        ],
      },
    ],
  },
  {
    path: "/admin/reset-password/:token",
    Component: AdminResetPassword,
  },
]);
export default Router