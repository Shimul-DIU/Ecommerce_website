import { createContext, useState } from "react";
export const authContext=createContext()

export const AuthProvider = ({children}) => {
  const [token,setToken]=useState(localStorage.getItem('userToken'))
  const login=(newtoken)=>{
    localStorage.setItem("userToken" , newtoken)
    setToken(newtoken)
  }
  const logout=()=>{
    localStorage.removeItem("userToken")
    setToken(null)
  }
  return (
    <authContext.Provider value={{token,login,logout}}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;