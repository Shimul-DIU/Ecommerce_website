import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useEffect } from "react";

const useProducts = () => {
  const[products,setProducts]=useState([])
  const[loading,setLodaing]=useState(true)
  const[error,setError]=useState(null)
  useEffect(()=>{
    const fetchProducts=async()=>{
     try {
        setLodaing(true)
       const response=await axiosInstance.get('/api/products')
       setProducts(response.data.data)

    }
     catch (error) {

      setError(error.response?.data?.message || error.message)
     }
     finally{
      setLodaing(false)
     }

  }
  fetchProducts()
  },[])
  return [products,loading,error];
};

export default useProducts;