import e from "express";
import { addNewCourse, deleteCourse, getAllCourses, getCourseDetail, updateCourse } from "../../controllers/admin-Controllers/index.js";

const router = e.Router()

router.post("/add", addNewCourse)
router.get("/get", getAllCourses)
router.get("/get/details/:id",getCourseDetail)
router.put("/update/:id", updateCourse)
router.delete("/delete/:id", deleteCourse)

export default router