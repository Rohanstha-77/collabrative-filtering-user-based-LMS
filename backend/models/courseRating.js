import mongoose  from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    rating: Number
}, {timestamps: true})

const rating = mongoose.model("Rating", ratingSchema)

export default rating