import mongoose from "mongoose"

const studentCoursesSchema = new mongoose.Schema({
    userId: String,
    courses: [
        {
            courseId: String,
            title: String,
            adminId: String,
            adminName: String,
            image: String,
        }
    ]
})

const studentCourse = mongoose.model("StudentCourses", studentCoursesSchema)

export default studentCourse