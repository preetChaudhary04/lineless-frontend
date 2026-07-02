import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from "./app.routes"
import { AuthProvider } from './features/auth/context/authContext'
import { ServicesProvider } from './features/services/context/servicesContext'

const App = () => {
  return (
    <>
      <AuthProvider>
        <ServicesProvider>
          <RouterProvider router={router} />
        </ServicesProvider>
      </AuthProvider>
    </>
  )
}

export default App