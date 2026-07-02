import { createBrowserRouter } from 'react-router'
import Register from './features/auth/pages/Register'
import Login from './features/auth/pages/Login'
import ServicesDashboard from './features/services/pages/ServicesDashboard'
import MyTicketsDashboard from './features/tickets/pages/MyTicketsDashboard'
import MerchantLineManager from './features/tickets/pages/MerchantLineManager'

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
  {
    path: "/my-tickets",
    element: <MyTicketsDashboard />
  },
  {
    path: "/manage-line/:serviceId",
    element: <MerchantLineManager />
  }
])