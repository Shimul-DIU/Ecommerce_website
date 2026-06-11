import { createBrowserRouter } from "react-router-dom"
import Root from "../layout/Root"
import Home from './../pages/Home';
import Categories from "../pages/Categories";
import Products from "../pages/Products";
import Login from "../auth/Login";
import Register from "../auth/Register";
import admin from './../pages/admin';

// Placeholder component for Cart
import Cart from "../components/comon/Cart";

const Router=createBrowserRouter([
  {
    path:'/',
    Component:Root,
    children:[
      { index: true, Component: Home },
      {
        path: "categories",
        Component:Categories
      },
      {
        path: "products",
        Component: Products
      },
      {
        path: "login",
        Component: Login
      },
      {
        path: "register",
        Component:Register
      },
      {
        path: "admin",
        Component:admin
      },
      {
        path: "cart",
        Component:Cart
      },
    ]

  }
])
export default Router