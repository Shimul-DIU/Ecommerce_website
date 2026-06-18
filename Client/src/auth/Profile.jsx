import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
const Profile = () => {
  const {logout}=useContext(authContext)
   const [user, setUser] = useState(null);
   const navigate=useNavigate();

   const handleLogout=()=>{
    logout()
    navigate('/login');


   }
  useEffect(()=>{
    const fetchProfile=async()=>{
      try {
        const token=localStorage.getItem('token');
        const res=await axios.get('http://localhost:4000/user/profile',{
          headers:{
            Authorization: token
          }
        })
        setUser(res.data);

      } catch (error) {
        console.log(error)
      }
    }
    fetchProfile();
  },[])
  return (
    <div className="p-8">
      this is profile page
      {user && (
        <div>
            <p>user : {user.fullname}</p>
            <p>email : {user.email}</p>
            <p onClick={handleLogout} className='cursor-pointer bg-blue-400 rounded-md py-2 px-0 w-18 text-center text-white'>logout</p>
        </div>

      )} <hr />
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt possimus ut dicta non iusto? Labore perferendis repellendus, architecto numquam ab cupiditate? Nulla dignissimos harum at veniam. Optio odio laboriosam ad maiores animi accusamus suscipit voluptatibus blanditiis cupiditate nobis dolore doloremque quas officia, officiis tempore? Officiis cumque ut amet reprehenderit eum earum quidem fugit facere est. Eveniet nihil veniam cumque ipsam, dicta, expedita repudiandae earum distinctio aliquid iusto quae, aperiam magni.
    </div>
  );
};

export default Profile;