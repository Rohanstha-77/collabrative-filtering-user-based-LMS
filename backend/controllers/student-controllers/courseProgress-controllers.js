import courseProgress from "../../models/courseProgress.js"
import Course from "../../models/Course.js"
import studentCourse from "../../models/studentCourses.js"


export const markCurrentCourseAsViewed = async(req,res) => {
    try {
        
        const {userId, courseId, lectureId} = req.body

        let progress = await courseProgress.findOne({userId, courseId})

        if(!progress){
            progress = new courseProgress({
                userId,
                courseId,
                lectureProgress: [
                    {
                        lectureId, viewed: true, dateViewed: new Date()
                    }
                ]
            })
            await progress.save()
        }else{
            const lectureProgress = progress.lectureProgress.find(item => item.lectureId === lectureId)

            if(lectureProgress){
                lectureProgress.viewed = true,
                lectureProgress.dateViewed = new Date()
            }else{
                progress.lectureProgress.push({
                    lectureId,
                    viewed: true,
                    dateViewed: new Date()
                })
            }
            await progress.save()
        }

        const course = await Course.findById(courseId)

        if(!course) return res.status(200).json({
            success: false,
            message: "course not found"
        })

        // check all the lecture are view or not

        const allLectureviewed = progress.lectureProgress.length === course.curriculum.length && progress.lectureProgress.every(item => item.viewed)

        if(allLectureviewed){
            progress.completed = true,
            progress.completionDate = new Date()

            await progress.save()
        }

        res.status(200).json({
            success: true,
            message: "Lecture marked as viewed",
            data: progress
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}

export const getCurrentCourseProgress = async(req,res) => {
    try {
        const {userId,courseId} = req.params

        const courseEnrolled = await studentCourse.findOne({userId})

        
        const isCurrentCourseEnrolled =  courseEnrolled?.courses?.findIndex(item => item.courseId === courseId) > -1

        if(!isCurrentCourseEnrolled) return res.status(200).json({
            success: true,
            data: {
                isEnrolled: false
            },
            message: "you are not enroll in this course"
        })

        const currentCourseProgress = await courseProgress.findOne({userId, courseId})

        if(!currentCourseProgress || currentCourseProgress.lectureProgress.length === 0){
            const course = await Course.findById(courseId)
            if(!course) return res.status(200).json({
                success: false,
                message: "course not found"
            })

            return res.status(200).json({
                success: true,
                message: " No progress found",
                data: {
                    courseDetails : course,
                    progress: [],
                    isEnrolled: true
                }
            })
        }
        const courseDetails = await Course.findById(courseId)
        const responseData = {
            courseDetails,
            progress: currentCourseProgress.lectureProgress,
            completed: currentCourseProgress.completed,
            completionDate: currentCourseProgress.completionDate,
            certificateUrl: currentCourseProgress.certificateUrl,
            isEnrolled: true
        };
        console.log("Backend sending course progress data:", responseData);
        res.status(200).json({
            success: true,
            message:"Course Details of get current Course Progress",
            data: responseData
        })
        


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}

export const resetCurrentCourse = async(req,res) => {
    try {
        const {userId, courseId} = req.body

        const progress = await courseProgress.findOne({userId, courseId})

        if(!progress) return res.status(200).json({
            success: false,
            message: "progress not found"
        })

        progress.lectureProgress = []
        progress.completed = false
        progress.completionDate = null

        await progress.save()

        res.status(200).json({
            success: true,
            message: "course progress has been reset",
            data: progress
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}