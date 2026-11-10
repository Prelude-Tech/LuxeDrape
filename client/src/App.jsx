import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import MasterDashboard from './pages/admin/MasterDashboard'
import SecondaryDashboard from './pages/admin/SecondaryDashboard'

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'master_admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/admin/secondary" replace />
  }

  return children
}

function AppRoutes() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        
        {/* Dedicated Category & Sub-category routes */}
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/category/:categoryName/:subCategory" element={<CategoryPage />} />

        {/* Friendly direct routes as specified in PRD (e.g., /women/sarees, /men/shirts) */}
        <Route path="/men" element={<CategoryPage defaultCategory="Men" />} />
        <Route path="/men/:subCategory" element={<CategoryPage defaultCategory="Men" />} />
        <Route path="/women" element={<CategoryPage defaultCategory="Women" />} />
        <Route path="/women/:subCategory" element={<CategoryPage defaultCategory="Women" />} />
        <Route path="/kids" element={<CategoryPage defaultCategory="Kids" />} />
        <Route path="/kids/:subCategory" element={<CategoryPage defaultCategory="Kids" />} />
        <Route path="/unisex" element={<CategoryPage defaultCategory="Unisex" />} />
        <Route path="/unisex/:subCategory" element={<CategoryPage defaultCategory="Unisex" />} />

        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route
          path="/admin/login"
          element={
            isAuthenticated ? (
              user?.role === 'master_admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/admin/secondary" replace />
              )
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['master_admin']}>
              <MasterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/secondary"
          element={
            <ProtectedRoute allowedRoles={['secondary_admin', 'master_admin']}>
              <SecondaryDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#f8fafc',
          },
          success: {
            iconTheme: { primary: '#4F46E5', secondary: '#fff' },
          },
        }}
      />
      <AppRoutes />
    </>
  )
}
