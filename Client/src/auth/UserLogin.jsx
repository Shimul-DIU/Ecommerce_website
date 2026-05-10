import React from 'react';
import logo from '../assets/images/logo.png'
const userLogin = () => {
  return (
    <div>
      <form action="">
        <img src={logo} alt="logo" />
        <h1>Welcome back</h1>
        <p>Sign in to continue shopping</p>
        <div className='rounded-2xl'>
          <label htmlFor="email">Email address</label>
          <input type="email" placeholder='you@example.com' />
        </div>
      </form>

    </div>
  );
};

export default userLogin;