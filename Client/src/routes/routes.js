import { createBrowserRouter } from "react-router-dom"
import Root from "../layout/Root"
import Home from './../pages/Home';
import Categories from "../pages/Categories";
import Products from "../pages/Products";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Cart from "../components/comon/Cart";
import Profile from "../auth/Profile";


// admin

import AdminLogin from "../pages/admin/AdminLogin";
import Adminlayout from "../layout/Adminlayout";
import Orders from "../pages/admin/Orders";
import Customers from "../pages/admin/Customers";
import Setting from "../pages/admin/Setting";
import AdminProducts from '../pages/admin/product/AdminProducts';
import Dashboard from "../pages/admin/Dashboard";
import AddProduct from "../pages/admin/product/AddProduct";
import EditProduct from "../pages/admin/product/EditProduct";




const Router=createBrowserRouter([
  {
    path:'/',
    Component:Root,
    children:[
     { index: true, Component: Home },
      { path: "categories", Component: Categories },
      { path: "products", Component: Products },
      { path: "cart", Component: Cart },
      { path: "profile", Component: Profile },
      { path: "login", Component: Login },
      { path: "register", Component: Register }
    ]

  },
  // admin route
  {
    path:'/admin/login',
    Component:AdminLogin
  },
  {
   path:'/admin',
   Component:Adminlayout,
   children:[
     { index: true, Component: Dashboard },

      // products CRUD
      { path: "products", Component: AdminProducts },
      { path: "products/add", Component: AddProduct },
      { path: "products/edit/:id", Component: EditProduct },

      // other admin pages
      { path: "orders", Component: Orders },
      { path: "customers", Component: Customers},
      { path: "setting", Component: Setting },
   ]
  }
])
export default Router