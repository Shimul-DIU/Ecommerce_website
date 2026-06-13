import React from 'react';
import axios from 'axios';
import { useState } from 'react';
const AdminLogin = () => {
  const
  const [message,setMessage]=useState('')
  const [formData,setFormData]=useState({
    email:'',
    password:''
  })
  const handleChange=(e)=>{
    setFormData((prev)=>({
      ...prev,
      [e.target.name]:e.target.value

    }))


  }
  const submitHandler=async(e)=>{
    try {
      e.preventDefault()
      const res=await axios.post('http://localhost:4000/admin/loginAdmin',formData)
      console.log(res)
      lo
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className='flex items-center'>
          <h1>Admin Login</h1>
         <h3>Sign in to access dashboard</h3>
        </div>
        <label htmlFor="email">Email</label>
        <input type="email" onChange={handleChange()} name='email' for="Email" placeholder='admin@gmail.com'/>

        <label htmlFor="password">Password</label>
        <input type="password" onChange={handleChange()} for="Password" name='password' placeholder='******'/>

        <div className='flex justify-end'>
          <div>
            <input type="checkbox" name="" id="" />
            <p>Remember me</p>
          </div>
          <div>
            <p>Forgot Password?</p>
          </div>
        </div>
        <button className='text-white bg-black p-2 w-full'>
          Login
        </button>

      </form>
    </div>
  );
};

export default AdminLogin;