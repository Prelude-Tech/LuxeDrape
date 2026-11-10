import { useState, useCallback } from 'react'
import api from '../lib/api'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/products', { params })
      const { data, pagination: pg } = response.data
      setProducts(data || [])
      setPagination(pg || null)
      return data || []
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback((params) => fetchProducts(params), [fetchProducts])

  return { products, pagination, loading, error, fetchProducts, refetch }
}
