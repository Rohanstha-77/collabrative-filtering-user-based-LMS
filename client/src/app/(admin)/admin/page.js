"use client"
import { AuthContext } from '@/context/auth-context'
import React, { useContext } from 'react'
import ADashboard from './dashboard/page'
import Course from './course/[courseId]/page'
import RouteGuard from '@/components/protected-route/page'

const Home = () => {
    const {auth} = useContext(AuthContext)

  return (
    <>
    <RouteGuard authenticated={auth.authenticate} user={auth.user}>
        <ADashboard/>
        {/* <Course/> */}
    </RouteGuard>
    </>
)
}

export default Home