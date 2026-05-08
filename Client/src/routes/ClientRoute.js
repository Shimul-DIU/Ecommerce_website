import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/client/Home"

let clientRoute=createBrowserRouter([
  {
    path:'/',
    Component:Home,
  }
])
export default clientRoute