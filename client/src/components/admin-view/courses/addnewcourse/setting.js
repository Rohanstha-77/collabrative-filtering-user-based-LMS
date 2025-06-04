"use client"

import MediaProgessBar from '@/components/mediaProgressBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminContext } from '@/context/admin-context'
import { mediaUploadService } from '@/services'
import Image from 'next/image'
import React, { useState } from 'react'
import { useContext } from 'react'

function Setting() {
  const {courseLandingFormData,setCourseLandingFormData, mediaUpload,setMediaUpload, mediaProgess, setMediaProgress} = useContext(AdminContext)
  const [ response, setResponse] = useState()
  const handleImageUpload = async(e) => {
    const selectedImage = e.target.files[0];

    if(selectedImage){
      const imageFormData = new FormData()
      imageFormData.append('file', selectedImage)
      try {
        setMediaUpload(true)
        const response = await mediaUploadService(imageFormData, setMediaProgress)
        // console.log(response) 
        
        if(response.success){
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response?.data?.url
          })
        }
        setMediaUpload(false)
      } catch (error) {
        console.error(error);
        
      }
    }
  }
  // console.log(courseLandingFormData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Setting</CardTitle>
      </CardHeader>
      <div className='p-4'>
        {
          mediaUpload ? (<MediaProgessBar isMediaUploading={mediaUpload} progress={mediaProgess}/>): null
        }
      </div>
      <CardContent>
        {
          courseLandingFormData?.image ? 
          <Image src={courseLandingFormData?.image} height={400} width={500} alt='LandingapageImage'/> 
          : 
          <div className='flex flex-col gap-3'>
            <Label>Upload Course Image</Label>
            <Input onChange = {handleImageUpload} type="file" accept="image/*"/>
          </div>
        }
      </CardContent>
    </Card>
  )
}

export default Setting