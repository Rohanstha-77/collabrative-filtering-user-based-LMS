"use client"
import FormControl from '@/components/common-form/form-controls'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { courseLandingPageFormControls } from '@/config'
import { AdminContext } from '@/context/admin-context'
import React, { useContext } from 'react'

const CourseLandingPage = () => {
  const {courseLandingFormData,setCourseLandingFormData} = useContext(AdminContext)
  // console.log(courseLandingFormData)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Landing Page</CardTitle>
      </CardHeader>

      <CardContent>
        <FormControl 
        formControls={courseLandingPageFormControls}
        formData={courseLandingFormData}
        setFormData={setCourseLandingFormData}
        />
      </CardContent>
    </Card>
)
}

export default CourseLandingPage