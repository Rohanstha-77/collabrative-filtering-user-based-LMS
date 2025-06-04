import mongoose from "mongoose"


const lectureProgressSchema = new mongoose.Schema({
    lectureId: String,
    viewed: Boolean,
    dateViewed: Date
})
const cosurseProgressSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    completed: String,
    completionDate: String,
    lectureProgress: [lectureProgressSchema],
    
})

const CourseProgress = mongoose.model("Course Progress", cosurseProgressSchema)
export default CourseProgress