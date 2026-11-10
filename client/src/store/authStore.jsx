import { createContext, useContext, useReducer, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  loading: true, // start true so we check session on mount
  isAuthenticated: false,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false }
    case 'LOGOUT':
      return { ...initialState, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // On mount: verify existing session cookie
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get('/auth/me')
        if (res.data?.user) {
          dispatch({ type: 'SET_USER', payload: res.data.user })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }
    checkSession()
  }, [])

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

// Raw context hook (used internally by useAuth.js)
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthContext must be used within AuthProvider')
  return context
}
