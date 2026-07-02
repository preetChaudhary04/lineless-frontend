import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from "./app.routes"
import { AuthProvider } from './features/auth/context/authContext'
import { ServicesProvider } from './features/services/context/servicesContext'
import { TicketsProvider } from './features/tickets/context/ticketContext'

const App = () => {
  return (
    <>
      <AuthProvider>
        <ServicesProvider>
          <TicketsProvider>
            <RouterProvider router={router} />
          </TicketsProvider>
        </ServicesProvider>
      </AuthProvider>
    </>
  )
}

export default App