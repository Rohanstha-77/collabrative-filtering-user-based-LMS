import e from "express"
import { getAllStudentCourses, getCoursesDetails } from "../../controllers/student-controllers/courseControllers.js"

const router = e.Router()

router.get('/get', getAllStudentCourses)
router.get('/get/details/:id/:userId', getCoursesDetails)

export default router