import { createBrowserRouter, Navigate } from 'react-router';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import ServicesDashboard from './features/services/pages/ServicesDashboard';
import MyTicketsDashboard from './features/tickets/pages/MyTicketsDashboard';
import MerchantLineManager from './features/tickets/pages/MerchantLineManager';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/services",
        element: <ServicesDashboard />
      }
    ]
  },
  {
    element: <ProtectedRoute allowedRoles={["CUSTOMER"]} />,
    children: [
      {
        path: "/my-tickets",
        element: <MyTicketsDashboard />
      }
    ]
  },
  {
    element: <ProtectedRoute allowedRoles={["PROVIDER", "ADMIN"]} />,
    children: [
      {
        path: "/manage-line/:serviceId",
        element: <MerchantLineManager />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/services" replace />
  }
]);