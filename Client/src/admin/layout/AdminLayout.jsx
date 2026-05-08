import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar'
const AdminLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Sidebar></Sidebar>
      <Outlet/>

    </div>
  );
};

export default AdminLayout;