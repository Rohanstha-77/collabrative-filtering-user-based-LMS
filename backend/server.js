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
import adminAssignmentRoute from "./route/admin-route/assignment-route.js"
import studentAssignmentRoute from "./route/student-route/assignment-route.js"
import certificateRoute from "./route/certificate-route.js"


dotenv.config()
const app = express()
const port = process.env.PORT || 8080;


const allowedOrigins = [
  process.env.LOCAL_CLIENT,
  process.env.CLIENT_URL,
  process.env.NGINX_CLIENT_URL,
  "http://localhost:3001"
];

app.use(cors({
    origin: (origin, callback) => {
    // allow requests with no origin (e.g., Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Not allowed by origin"));
    }
},
    methods: ["POST", "GET", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json())
app.disable("x-powered-by")

// Serve static files from the 'upload' directory
app.use('/upload', express.static('upload'));


mongoose.connect(process.env.MONGO_URL,{
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
}).then(() => console.log("mongodb connected sucessfully")).catch((e) => console.log(e))

app.use('/auth', AuthRoute)
app.use("/media",mediaRoute)
app.use("/admin/course",AdminRoute)
app.use("/student/course",studentRoute)
app.use("/student/enrollcourses",studentCourses)
app.use("/student/courseprogress",stdCourseProgress)
app.use("/recommendation",courseRecommendation)
app.use("/admin/assignment",adminAssignmentRoute)
app.use("/student/assignment",studentAssignmentRoute)
app.use("/certificates", certificateRoute)

app.listen(port, () => {
    console.info("server is running" + port)
})


