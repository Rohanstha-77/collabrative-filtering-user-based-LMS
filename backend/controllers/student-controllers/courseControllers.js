import Course from "../../models/Course.js"
import studentCourse from "../../models/studentCourses.js"
export const getAllStudentCourses = async (req, res) => {
    try {
        const { category = [], level = [], sortBy = 'rate' } = req.query
        let filters = {}
        if (category.length) filters.category = { $in: category.split(',') }
        if (level.length) filters.level = { $in: level.split(',') }


        let sort = {}

        switch (sortBy) {
            case "rate":
                sort.averageRating = -1
            case "price-lowtohigh":
                sort.pricing = 1
                break;
            case "price-hightolow":
                sort.pricing = -1
                break;
            case "title-atoz":
                sort.title = 1
                break;
            case "title-ztoa":
                sort.title = -1
                break;

            default:
                sort.pricing = 1
                break;
        }

        const coursesList = await Course.find(filters).sort(sort)
        if (coursesList.length === 0) return res.status(200).json({
            success: false,
            message: "No courses found",
            data: []
        })
        res.status(200).json({
            success: true,
            data: coursesList
        })
    } catch (error) {
        console.log("error from getallstudentContoller", error)
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}
export const getCoursesDetails = async (req, res) => {
    try {
        const { id, userId } = req.params;

        // Fetch the course details
        const courseDetails = await Course.findById(id);
        // if (!courseDetails) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Course not found",
        //         data: null
        //     });
        // }

        // Fetch the student's enrolled courses
        const studentCourses = await studentCourse.findOne({ userId: userId });
        if (!studentCourses || !Array.isArray(studentCourses.courses)) {
            return res.status(200).json({
              success: true,
              data: courseDetails,
              enrollCourseID: null
            });
          }

        // Check if the student is enrolled in the course
        const isStudentEnrolled = studentCourses.courses.some(item => item.courseId === id);
        // Respond with course details and enrollment status
        return res.status(200).json({
            success: true,
            data: courseDetails,
            enrollCourseID: isStudentEnrolled ? id : null
        });

    } catch (error) {
        console.error("Error in getCoursesDetails:", error.message);
        res.status(500).json({
            success: false,
            message: "An internal server error occurred",
            error: error.message
        });
    }
};


