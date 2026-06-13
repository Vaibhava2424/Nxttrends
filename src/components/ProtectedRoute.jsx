import React from 'react'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

// v6 protected wrapper component pattern
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(Cookies.get('jwt_token'))
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute