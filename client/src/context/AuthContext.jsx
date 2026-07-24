import { createContext, useState } from "react";
export const authContext=createContext()

export const AuthProvider = ({children}) => {
  const [token,setToken]=useState(localStorage.getItem('token'))
  const login=(newtoken)=>{
    localStorage.setItem("token" , newtoken)
    setToken(newtoken)
  }
  const logout=()=>{
    localStorage.removeItem("token")
    setToken(null)
  }
  return (
    <authContext.Provider value={{token,login,logout}}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;