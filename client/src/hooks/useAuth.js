import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../store/authStore'
import api from '../lib/api'

export function useAuth() {
  const { state, dispatch } = useAuthContext()
  const navigate = useNavigate()

  const login = useCallback(async (username, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await api.post('/auth/login', { username, password })
      const user = response.data.user
      dispatch({ type: 'SET_USER', payload: user })
      return user
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw err
    }
  }, [dispatch])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore error, still clear local state
    } finally {
      dispatch({ type: 'LOGOUT' })
      navigate('/')
    }
  }, [dispatch, navigate])

  return {
    user: state.user,
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
  }
}
