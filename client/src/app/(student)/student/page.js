"use client"
import ProtectedRoute from '@/components/protected-route/page'
import { AuthContext } from '@/context/auth-context'
import React, { useContext } from 'react'
import Dashboard from './dashboard/page'

const Home = () => {
    const {auth} = useContext(AuthContext)
     
  return (
    // <ProtectedRoute authenticated={auth.authenticate} user={auth.user}>
      <Dashboard/>
    // </ProtectedRoute>


  )
}

export default Home