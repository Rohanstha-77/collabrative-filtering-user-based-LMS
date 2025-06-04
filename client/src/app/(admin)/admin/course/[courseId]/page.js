"use client"
import Circurriculum from '@/components/admin-view/courses/addnewcourse/circurriculum'
import CourseLandingPage from '@/components/admin-view/courses/addnewcourse/course-landing-page'
import Setting from '@/components/admin-view/courses/addnewcourse/setting'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '@/config'
import { AdminContext } from '@/context/admin-context'
import { AuthContext } from '@/context/auth-context'
import { addCourseService, adminCourseDetailService, UpdateCourseService } from '@/services'
import { TabsContent } from '@radix-ui/react-tabs'
import { useParams, useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'
import { toast } from 'react-toastify'

const Course = () => {
    const {courseLandingFormData,courseCurriculumFormData,setCourseLandingFormData,setCourseCurriculumFormData} = useContext(AdminContext)
    const {auth} = useContext(AuthContext)
    const router = useRouter()
    const {currentEditCourseId,setCurrentEditCourseId} = useContext(AdminContext)
    const params = useParams()
    
    useEffect(() => {
        const courseId = params?.courseId
    
        if (courseId) {
            setCurrentEditCourseId(courseId === "new" ? null : courseId)
        }
    }, [params?.courseId])
    

    
    
    // console.log(courseId)
    // const isEditMode = currentEditCourseId !== "/addnewcourse";
    useEffect(() => {
        const fetchCurrentCourseData = async () => {
            const response = await adminCourseDetailService(currentEditCourseId)
            // console.log(response)
            if(response?.success){
                const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc,key) => {
                    acc[key] = response?.data[key] || courseLandingInitialFormData[key]
                    return acc
                }, {})
                setCourseLandingFormData(setCourseFormData)
                setCourseCurriculumFormData(response?.data?.curriculum || [])
            }
        }
        // console.log(currentEditCourseId)
    
        if (currentEditCourseId && currentEditCourseId !== "new") {
            fetchCurrentCourseData()
        }
    }, [currentEditCourseId])

    

    const isEmpty = (value) => {
        if(Array.isArray(value)) {return value.length === 0}

        return value === "" || value === null || value === undefined
    }

    const validateFormData = () => {
        for(const key in courseLandingFormData){
            if(isEmpty(courseLandingFormData[key])){
                return false
            }
        }

        let hasFreePreview = false

        for(const item of courseCurriculumFormData){
            if(isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) {return false}

            if(item.freePreview) {hasFreePreview = true }// found atleast one free preview true
        }
        return hasFreePreview
    }

    // console.log(currentEditCourseId)
    const handleCreateCourse = async() => {
        const FinalFormData = {
            adminId: auth?.user?._id,
            adminName: auth?.user?.username,
            date: new Date().toISOString(),
            ...courseLandingFormData,
            students: [
            ],
            curriculum: courseCurriculumFormData,
            isPublished: true
        }
        // console.log(FinalFormData)
        const resposne = currentEditCourseId !== null ? await UpdateCourseService(currentEditCourseId, FinalFormData) :await addCourseService(FinalFormData)

        if(resposne?.success){
            toast.success(resposne?.message)
            setCourseLandingFormData(courseLandingInitialFormData)
            setCourseCurriculumFormData(courseCurriculumInitialFormData)
            setCurrentEditCourseId(null)
        }else{
            toast.error(resposne?.message)
        }
        router.push("/admin")
    }


  return (
    <div className='container mx-auto p-4'>
        <div className='flex justify-between'>
            <h1 className='text-3xl font-extrabold mb-5'>Create New Course</h1>
            <Button 
            // disabled = {!validateFormData()} 
            onClick = {handleCreateCourse} className="text-sm tracking-wider font-bold px-8">Submit</Button>
        </div>

        <Card>
            <CardContent>
                <div className='container mx-auto p-4'>
                    <Tabs defaultValue="Curriculum" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="Curriculum">Curriculum</TabsTrigger>
                            <TabsTrigger value="courseLandingPage">course landing page</TabsTrigger>
                            <TabsTrigger value="setting">setting</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Curriculum">
                            <Circurriculum/>
                        </TabsContent>
                        <TabsContent value="courseLandingPage">
                            <CourseLandingPage/>
                        </TabsContent>
                        <TabsContent value="setting">
                            <Setting/>
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}


export default Course