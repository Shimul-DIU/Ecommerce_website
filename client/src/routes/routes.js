import { createBrowserRouter } from "react-router-dom"
import Userlayout from "../layout/Userlayout";
import Login from "../auth/Login";
import Register from "../auth/Register";

// admin

import Adminlayout from "../layout/Adminlayout";
import Orders from "../pages/admin/Orders";
import Setting from "../pages/admin/Setting";
import AdminProducts from '../pages/admin/product/AdminProducts';
import AddProduct from "../pages/admin/product/AddProduct";
import EditProduct from "../pages/admin/product/EditProduct";
import UserProtectedRoute from "./UserProtectedRoute";

import ResetPassword from "../auth/ResetPassword.jsx";
import AdminResetPassword from '../auth/AdminResetPassword.jsx';
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import Home from './../pages/client/Home';
import Categories from "../pages/client/Categories.jsx";
import Products from './../pages/client/Products';
import Customers from './../pages/admin/Customers';
import Card from './../components/common/Card';
import Checkout from "../pages/client/Checkout.jsx";
import MyOrders from "../components/common/MyOrder.jsx";
import AdminLogin from "../auth/AdminLogin.jsx";
import AdminProtectedRoute from "./AdminProtectedRoute.jsx";
import Overview from "../pages/client/userDashboard/Overview.jsx";
import Wishlist from "../pages/client/userDashboard/Wishlist.jsx";
import Addresses from "../pages/client/userDashboard/Addresses.jsx";
import UserProfile from "../pages/client/userDashboard/UserProfile.jsx";
import UserDashboardLayout from "../pages/client/userDashboard/UserDashboardLayout.jsx";
import OrderSuccess from "../components/common/OrderSuccess.jsx";
import UserOrders from "../components/client/userDashboard/UserOrders.jsx";
import Contact from "../pages/client/Contract.jsx";
import Offer from "../pages/client/Offer.jsx";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: Userlayout,
    children: [
      { index: true, Component: Home },
      { path: "categories", Component: Categories },
      { path: "products", Component: Products },
      { path: "offers", Component: Offer },
      { path: "contact", Component: Contact },
      { path: "card", Component: Card },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "checkout", Component: Checkout },
      { path: "orders", Component: MyOrders },
      { path: "order-success", Component: OrderSuccess },
      { path: "reset-password/:token", Component: ResetPassword },
      {
        path: "userDashboard",
        Component: UserProtectedRoute,
        children: [
          {
            Component: UserDashboardLayout,
            children: [
              { index: true, Component: Overview },
              {path: "user-overview",Component: Overview},
              { path: 'user-orders', Component: UserOrders },
              { path: 'user-wishlist', Component: Wishlist },
              { path: 'user-addresses', Component: Addresses },
              { path: 'user-profile', Component: UserProfile }
            ]
          },


        ],
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
    Component: AdminProtectedRoute,
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