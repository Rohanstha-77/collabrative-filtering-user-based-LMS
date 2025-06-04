import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
    userId: String,
    recommendationCourses:[{
        courseId: String,
        title: String,
        image: String
    }]
})

const recommendation = new mongoose.model("Recommendation", recommendationSchema)

export default recommendation