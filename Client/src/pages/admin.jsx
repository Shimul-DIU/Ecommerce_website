import { useState } from 'react';
import axios from 'axios';
const admin = () => {
  const [admin,setAdmin]=useState({
      email:"",
      password:"",
      confirmPassword: ""
    })
  const handleChange=(e)=>{
      setAdmin((Prev)=>({
          ...Prev,
          [e.target.name]:e.target.value,

      }))
  }

  const formHandler=async(e)=>{
    e.preventDefault()
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      let res=await axios.post(`${API_BASE_URL}/api/createAdmin`,admin)
      alert('Admin created successfully')
      setAdmin({email:"", password:"", confirmPassword:""})
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create admin')
    }
  }
  return (
    <div>
      <form onSubmit={formHandler}>
          <label htmlFor='email'>Email :
              <input type='email' name='email'onChange={handleChange} ></input>
          </label>
          <label htmlFor='password'>Password :
              <input type='password' name='password' onChange={handleChange} ></input>
          </label>
          <label htmlFor='confirmPassword'>Confirm Password :
              <input type='password' name='confirmPassword' onChange={handleChange} ></input>
          </label>
          <button type='submit'>Create Admin</button>
      </form>
    </div>
  );
};

export default admin;