"use client"
import RouteGuard from '@/components/protected-route/page'
import React, { useContext } from 'react'
import { AuthContext } from '@/context/auth-context'

const RootLayout = ({children}) => {

  const {auth} = useContext(AuthContext)
  // console.log(auth)
  return (
    <RouteGuard authenticated={auth.authenticate} user={auth.user} >
        {children}
    </RouteGuard>
  )
}

export default RootLayout