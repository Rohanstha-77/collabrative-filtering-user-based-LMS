"use client"
import Adashboard from '@/components/admin-view/aDashboard/page'
import Courses from '@/components/admin-view/courses'
import ProtectedRoute from '@/components/protected-route/page'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { AdminContext } from '@/context/admin-context'
import { AuthContext } from '@/context/auth-context/index'
import { adminCourseListService } from '@/services'
import { BarChart, Book, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const ADashboard = () => {
  // const {auth} = useContext(AuthContext)
  // // console.log(auth)
  const {adminCourseList,setAdminCourseList} = useContext(AdminContext)
  const [activeTab,setActiveTab] = useState("Dashboard")
  const{logOut} =useContext(AuthContext)
  const router = useRouter()


  const fetchAllCourses = async() => {
    const response = await adminCourseListService()
    // console.log(response)
    if(response?.success) setAdminCourseList(response?.data)
  }
  useEffect(() => {
    fetchAllCourses()
  },[])
  const handleLogOut = () => {
    logOut()
    router.replace("/signin")
  }

  const menuItem = [
    {
      icon: BarChart,
      label: 'Dashboard',
      value: 'dashboard',
      component: <Adashboard listOfCourses={adminCourseList}/>
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <Courses listOfCourses={adminCourseList}/>
    },
    {
      icon: LogOut,
      label: "Log out",
      value: "logOut",
      component: <Courses/>
    }
  ]
  return (
    <div className='flex h-full min-h-screen bg-gray-100'>
      <aside className='w-64 bg-white shadow-md hidden md:block'>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Admin</h2>
            <nav>
              {
                menuItem.map(item => (
                  <Button variant={activeTab === item.label ? "secondary" : "ghost"} className="w-full justify-start mb-2" onClick = {item.value === 'logOut' ? handleLogOut: () => setActiveTab(item.value)} key={item.value}> <item.icon className='mr-2 h-4 w-4'/> {item.label} </Button>
                ))
              }
            </nav>
        </div>
      </aside>

      <main className='flex-1 p-8 overflow-y-auto'>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            Dashboard
          </h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
              {
                menuItem.map(item => 
                  <TabsContent key={item.value} value={item.value}>
                     {item.component !== null ? item.component : null}
                  </TabsContent>
                )
              }
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default ADashboard