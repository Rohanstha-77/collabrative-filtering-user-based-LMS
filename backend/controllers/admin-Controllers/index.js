import Course from "../../models/Course.js"
import CourseProgress from "../../models/courseProgress.js"
import rating from "../../models/courseRating.js"
import recommendation from "../../models/recommendation.js"
import studentCourse from "../../models/studentCourses.js"

export const addNewCourse = async(req,res) => {
    try {
        const courseData = req.body 
        // console.log(courseData)
        const newCourse = new Course(courseData)

        const saveCourse = await newCourse.save()
        
        if(saveCourse){
            res.status(200).json({
                success: true,
                message: "course saved successfully",
                data: saveCourse
            })
        }
    } catch (error) {
        console.log("add new course",error)
        res.status(500).json({
            success: false,
            message: "some error occur in add new course controller"
        })
    }
}
export const getAllCourses = async(req,res) => {
    try {
        const coursesList = await Course.find({});
        res.status(200).json({
            success: true,
            data: coursesList
        })
    } catch (error) {
        console.log("gell all courses",error)
        res.status(500).json({
            success: false,
            message: "some error occur in aget all courses controller"
        })
    }
}
export const getCourseDetail = async(req,res) => {
    try {
        const {id} = req.params;
        const courseDetail = await Course.findById(id)

        if(!courseDetail) return res.status(200).json({
            success: false,
            message: "course not found"
        })

        res.status(200).json({
            success: true,
            data: courseDetail
        })
    } catch (error) {
        console.log("get course detail",error)
        res.status(500).json({
            success: false,
            message: "some error occur in get course detail controller"
        })
    }
}
export const updateCourse = async(req,res) => {
    try {
        const {id} = req.params;
        // console.log(id)
        const updateCourseData = req.body

        const UpdatedCourse = await Course.findByIdAndUpdate(id,updateCourseData,{new:true})

        if(!UpdatedCourse) return res.status(200).json({
            success: false,
            message: "course not found"
        })

        res.status(200).json({
            success: true,
            message: "course updated successfully",
            data: UpdatedCourse
        })
    } catch (error) {
        console.log("update Course",error)
        res.status(500).json({
            success: false,
            message: "some error occur in update course controller"
        })
    }
}

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);
    await Promise.all([
        CourseProgress.findOneAndDelete({courseId: id}),
        rating.findOneAndDelete({courseId: id}),
        recommendation.updateMany(
        {},
        { $pull: { recommendationCourses: { courseId: id } } }
        ),
        studentCourse.updateMany(
        {},
        { $pull: { courses: { courseId: id } } }
        )
    ])

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, failed to delete course",
    });
  }
};
