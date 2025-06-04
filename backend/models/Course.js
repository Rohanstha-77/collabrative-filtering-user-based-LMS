import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema({
    title: String,
    videoUrl: String,
    public_id: String,
    freePreview: Boolean
})
const CourseSchema = new mongoose.Schema({
    adminId: String,
    adminName: String,
    date: Date,
    title: String,
    category: String,
    level: String,
    subtitle: String,
    description: String,
    image: String,
    welcomeMessage: String,
    pricing: Number,
    objectives: String,
    averageRating: mongoose.Schema.Types.Mixed,
    totalRating: mongoose.Schema.Types.Mixed,
    students: [
        {
            studentId: String,
            studentName: String,
            studentEmail: String
        }
    ],
    curriculum: [LectureSchema],
    isPublished: Boolean
})

const Course = mongoose.model("Course",CourseSchema)
export default Course