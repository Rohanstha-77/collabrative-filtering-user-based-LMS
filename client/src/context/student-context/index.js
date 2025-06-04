"use client"
import { studentCourseListService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const StudentContext = createContext(null)

export const StudentProvider = ({children}) => {
    const [studentCoursesList, setStudentCoursesList] = useState([])
    const [loadingState, setLoadingState] = useState(true)
    const [courseDetail, setCourseDetail] = useState(null)
    const [currentCourseId, setCurrentCourseId] = useState(null)
    const [studentEnrollCourse,setStudentEnrollCourse] = useState([])
    const [studentCourseProgress, setStudentCourseProgress] = useState({})
    return <StudentContext.Provider value={{studentCoursesList, setStudentCoursesList,loadingState, setLoadingState,courseDetail, setCourseDetail,currentCourseId, setCurrentCourseId,studentEnrollCourse,setStudentEnrollCourse, studentCourseProgress, setStudentCourseProgress}}>{children}</StudentContext.Provider>
}