import { createBrowserRouter } from "react-router-dom";
import AdminLogin from "../Auth/AdminLogin";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import Orders from './../pages/Orders';
import Products from "../pages/Products";
let AdminRouter=createBrowserRouter(
  [
    {
      path:'/admin/login',
      Component:AdminLogin
    },
    {
      path:'/admin',
      Component: AdminLayout,
      children:[
        {
          index:true,
          Component:Dashboard
        },
        {
          path:'/addProduct',
          Component:AddProduct
        },
        {
          path:'/editProduct',
          Component:EditProduct
        },
        {
          path:'/orders',
          Component:Orders
        },
        {
          path:'/produts',
          Component:Products
        }


      ]
    }
  ]
)
export default AdminRouter