import { createBrowserRouter } from 'react-router'
import Register from './features/auth/pages/Register'
import Login from './features/auth/pages/Login'
import ServicesDashboard from './features/services/pages/ServicesDashboard'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ServicesDashboard />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/services",
    element: <ServicesDashboard />
  },
])