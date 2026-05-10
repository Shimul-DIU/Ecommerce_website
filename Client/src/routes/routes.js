import { createBrowserRouter } from "react-router-dom"
import Root from "../layout/Root"
import Home from './../pages/Home';
import Categories from "../pages/Categories";
import Products from "../pages/Products";
import UserLogin from "../auth/UserLogin";
import UserRegister from "../auth/UserRegister";

let Router=createBrowserRouter([
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
        Component: UserLogin
      },
      {
        path: "register",
        Component: UserRegister
      },
    ]

  }
])
export default Router