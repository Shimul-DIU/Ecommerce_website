import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useProducts = (endpoint, options = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    autoFetch = true,
    dependencies = []
  } = options;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}${endpoint}`, {
        params: {
          page: pagination.page,
          limit: pagination.limit
        },
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      setProducts(response.data.products || response.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchProducts();
  };

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [endpoint, pagination.page, ...dependencies]);

  return {
    products,
    loading,
    error,
    refetch,
    loadMore,
    pagination,
    hasMore: pagination.page < pagination.totalPages
  };
};