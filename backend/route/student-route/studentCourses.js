import e from "express"
import  {getCoursesByStudentId,enrollCourse}  from "../../controllers/student-controllers/enrollCourses.js"


const router = e.Router()

router.post("/post", enrollCourse)
router.get("/get/:id", getCoursesByStudentId)

export default router