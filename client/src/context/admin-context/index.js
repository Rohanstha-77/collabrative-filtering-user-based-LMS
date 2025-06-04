"use client"
import react,{ createContext, useState } from "react";
import { courseCurriculumInitialFormData } from "@/config";

export const AdminContext = createContext(null)
const AdminProvider = ({children}) => {

    const [courseLandingFormData,setCourseLandingFormData] = useState()
    const [courseCurriculumFormData,setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData)
    const [mediaUpload,setMediaUpload] = useState(false)
    const [mediaProgess,setMediaProgress] = useState(0)
    const [adminCourseList,setAdminCourseList] = useState([])
    const [currentEditCourseId,setCurrentEditCourseId] = useState(null)

    return <AdminContext.Provider value={{setCourseLandingFormData,courseLandingFormData, courseCurriculumFormData,setCourseCurriculumFormData,mediaUpload,setMediaUpload,setMediaProgress,mediaProgess,adminCourseList,setAdminCourseList,currentEditCourseId,setCurrentEditCourseId}}>{children}</AdminContext.Provider>
}
export default AdminProvider