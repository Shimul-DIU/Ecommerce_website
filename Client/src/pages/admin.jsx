import React from 'react';
import axios from 'axios';
const admin = () => {
  const [admin,setAdmin]=useState({
      email:"",
      password:"",
      confirmPassword: ""
    })
  const handleChange=(e)=>{
    e.preventDefault()
      setAdmin((Prev)=>({
          ...Prev,
          [e.target.email]:e.target.email,

      }))
  }

  const formHandler=async(e)=>{
    e.preventDefault()
    let res=await axios.post('http://localhost:4000/api/createAdmin',admin)
    console.log(res.data.message)
  }
  return (
    <div>
      <form action="/admin/createAdmin" method="post" >
          <label for='email'>Email :
              <input type='email' name='email'onChange={handleChange} ></input>
          </label>
          <label for='password'>Password :
              <input type='password' name='password' onChange={handleChange} ></input>
          </label>
          <label for='confirmPassword'>Password :
              <input type='confirmPassword' name='confirmPassword' onChange={handleChange} ></input>
          </label>
          <button type='submit' onSubmit={formHandler}></button>
      </form>
    </div>
  );
};

export default admin;