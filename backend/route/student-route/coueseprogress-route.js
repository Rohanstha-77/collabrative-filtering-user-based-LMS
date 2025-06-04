import e from "express";
import { getCurrentCourseProgress, resetCurrentCourse,markCurrentCourseAsViewed } from "../../controllers/student-controllers/courseProgress-controllers.js";

const router = e.Router()

router.get("/get/:userId/:courseId",getCurrentCourseProgress)
router.post("/mark-lecture", markCurrentCourseAsViewed)
router.post("/reset-progress", resetCurrentCourse)

export default router