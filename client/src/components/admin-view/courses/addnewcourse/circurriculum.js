"use client"
import MediaProgessBar from '@/components/mediaProgressBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { VideoPlayer } from '@/components/videoplayer'
import { courseCurriculumInitialFormData } from '@/config'
import { AdminContext } from '@/context/admin-context'
import { bulkUploadService, mediaDeleteService, mediaUploadService } from '@/services'
import { Upload } from 'lucide-react'
import React, { useContext, useRef } from 'react'

const Circurriculum = () => {
  const {courseCurriculumFormData, setCourseCurriculumFormData,mediaUpload,setMediaUpload, mediaProgess, setMediaProgress} = useContext(AdminContext)
  const bulkUploadRef = useRef(null)

  //add new lecture 
  const handleNewLecture = () => {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0]
      }
    ])
  }

  const handleCourseTitle =(e,currentIndex) => {
    let courseData = [...courseCurriculumFormData]
    courseData[currentIndex] = {
      ...courseData[currentIndex],
      title: e.target.value
    }
    // console.log(courseData)
    setCourseCurriculumFormData(courseData)
  }
  
  const handlePreview = (currentIndex,currentValue) => {
    // console.log(currentIndex,currentValue)
    let courseData = [...courseCurriculumFormData]
    courseData[currentIndex] = {
      ...courseData[currentIndex],
      freePreview: currentValue
    }
    // console.log(courseData)
    setCourseCurriculumFormData(courseData)
    
  }
  const handleLecture = async(e,currentIndex) => {
    const selectedFile = e.target.files[0]

    if(selectedFile){
      const videoFormData = new FormData()
      videoFormData.append("file",selectedFile)
      // console.log(videoFormData)

      try {
        setMediaUpload(true)

        const response = await mediaUploadService(videoFormData, setMediaProgress)
        if(response?.success){
          let courseData = [...courseCurriculumFormData]
          courseData[currentIndex] = {
            ...courseData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id
          }
          setCourseCurriculumFormData(courseData)
          setMediaUpload(false)
        }
        // console.log(response?.data?.url)
        // console.log(response?.data?.public_id)
      } catch (error) {
        console.error(error);
        
      }
    }
  }

  const isCircurriculumValid = () => {
    return courseCurriculumFormData.every(item => {
      return item && typeof item === 'object' && item.title.trim() !== "" && item.videoUrl.trim() !== ""
    })
  }

  const handleRelpaceVideo = async(index) => {
    const courseData = [...courseCurriculumFormData]
    const getPublicId = courseData[index].public_id

    const deleteCurrentMediaRes = await mediaDeleteService(getPublicId)
    // console.log(deleteCurrentMedia)

    if(deleteCurrentMediaRes.success){
      courseData[index] = {
        ...courseData[index],
        videoUrl: "",
        public_id: ""
      }
    }
    setCourseCurriculumFormData(courseData)
  }

  const checkFormDataIsEmpty = (arr) => {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key,value]) => {
        if(typeof value === "boolean") {return true}
        return value === ''

      })
    })
  }
  const handleBulkUpload = async(event) => {
    const selectedFile = Array.from(event.target.files)
    // console.log(selectedFile)

    const bulkUploadData = new FormData()
    selectedFile.forEach(fileItem => bulkUploadData.append('files', fileItem))

    try {
      setMediaUpload(true)
      const response = await bulkUploadService(bulkUploadData,setMediaProgress) 
      // console.log(response)
      if(response?.success){
        let courseData = checkFormDataIsEmpty(courseCurriculumFormData) ? [] : [...courseCurriculumFormData]

        courseData = [
          ...courseData,
          ...response?.data.map((item,i) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `lecture ${ i +1}`,
            freePreview: false
          }))
        ]
        setCourseCurriculumFormData(courseData)
        setMediaUpload(false)
      }
    } catch (error) {
      
    }
  }
  const deleteLecture = async(currentIndex) => {
    let CourseData = [...courseCurriculumFormData]
    const getCurrentVideoPublicId = CourseData[currentIndex]
    const response = await mediaDeleteService(getCurrentVideoPublicId)

    if(response?.success){
      CourseData = CourseData.filter((_,i) => i !== currentIndex)
      setCourseCurriculumFormData(CourseData)
    }
  }
  // console.log(courseCurriculumFormData)
  // console.log(courseCurriculumFormData)
  // console.log(courseCurriculumFormData?.videoUrl)
  return (
    <Card>
      <CardHeader className={"flex flex-row justify-between"}>
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input type={"file"} ref = {bulkUploadRef} accept = "video/*" multiple className={"hidden"} id = "bulkMedia" onChange = {handleBulkUpload}/>

          <Button as = "label" htmlFor="bulkMedia" variant={"outline"} className={"cursor-pointer"} onClick = {() => bulkUploadRef.current?.click()}>
            <Upload className='w-4 h-4 mr-2'/>
            Bulk Upload
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Button disabled={!isCircurriculumValid() || mediaUpload} onClick={handleNewLecture}>Add Lecture</Button>
        {
          mediaUpload ? (<MediaProgessBar isMediaUploading={mediaUpload} progress={mediaProgess}/>): null
        }
        <div className="mt-4 space-y-4">
          {
            courseCurriculumFormData.map((item,index) => (
              <div key={index} className="border p-5 rounded-md">
                <div className="flex gap-5">
                  <h3 className="font-semibold">Lecture {index+1}</h3>
                  <Input name= {`title-${index+1}`}
                  placeholder = "Enter lecture Title"
                  className="max-w-96"
                  onChange = {(e) => handleCourseTitle(e,index)}
                  value={courseCurriculumFormData[index]?.title}
                  />

                  <div className="flex items-center space-x-2">
                    <Switch
                    onCheckedChange= {(value) => handlePreview(index,value)}
                      checked={courseCurriculumFormData[index]?.freePreview}
                      id={`freePreview-${index+1}`}
                    />
                    <Label htmlFor={`freePreview ${index+1}`}>Free Preview</Label>
                  </div>
                </div>

                <div className='mt-6'>
                  {
                    courseCurriculumFormData[index]?.videoUrl ? 
                    <div className='flex gap-3'>
                      <VideoPlayer url={courseCurriculumFormData[index]?.videoUrl} width='450px' height='200px'/>
                      <Button onClick = {() => handleRelpaceVideo(index)}>Replace Video</Button>
                      <Button onClick= {() => deleteLecture(index)} className={"bg-red-900"}>Delete Lecture</Button>
                    </div> : 
                    <Input
                    onChange={(e) => handleLecture(e,index)}
                    type={"file"}
                    accept={"video/*"}
                    className={"mb-4"}
                    />
                  }
                </div>
              </div>
            ))
          }
        </div>
      </CardContent>
    </Card>
  )
}

export default Circurriculum