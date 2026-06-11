import { useEffect, useState } from 'react';
import axios from 'axios';
const Profile = () => {
   const [user, setUser] = useState(null);
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
    <div>
      this is profile page
      {user && (
        <div>
            <p>user : {user.fullname}</p>
            <p>email : {user.email}</p>
        </div>

      )}
    </div>
  );
};

export default Profile;