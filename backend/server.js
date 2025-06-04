import dotenv from 'dotenv'
import express from 'express'
import cors from'cors'
import mongoose from 'mongoose'
import AuthRoute from './route/auth-route/index.js'
import mediaRoute from "./route/admin-route/mediaRoute.js"
import AdminRoute from "./route/admin-route/courseRoute.js"
import studentRoute from "./route/student-route/courses.js"
import studentCourses from "./route/student-route/studentCourses.js"
import stdCourseProgress from "./route/student-route/coueseprogress-route.js"
import courseRecommendation from "./route/recommendation/index.js"


dotenv.config()
const app = express()
const port = process.env.PORT || 8080;

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json())

mongoose.connect(process.env.MONGO_URL,{
    serverSelectionTimeoutMS: 30000, // ⬅️ 30 seconds
    socketTimeoutMS: 45000,
}).then(() => console.log("mongodb connected sucessfully")).catch((e) => console.log(e))

app.use('/auth', AuthRoute)
app.use("/media",mediaRoute)
app.use("/admin/course",AdminRoute)
app.use("/student/course",studentRoute)
app.use("/student/enrollcourses",studentCourses)
app.use("/student/courseprogress",stdCourseProgress)
app.use("/recommendation",courseRecommendation)

app.listen(port, () => {
    console.info("server is running" + port)
})


