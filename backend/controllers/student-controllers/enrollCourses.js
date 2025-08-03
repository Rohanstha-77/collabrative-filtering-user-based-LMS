import Course from "../../models/Course.js";
import CourseProgress from "../../models/courseProgress.js";
import studentCourse from "../../models/studentCourses.js";

export const enrollCourse = async (req, res) => {
  try {
    const { userId, courseId, title, adminId, adminName, image } = req.body;

    let student = await studentCourse.findOne({ userId });

    if (!student) {
      student = new studentCourse({
        userId,
        courses: [{ courseId, title, adminId, adminName, image }],
      });
    } else {
      const alreadyEnrolled = student.courses.some(
        (c) => c.courseId === courseId
      );
      if (alreadyEnrolled) {
        // return res.status(409).json({ success: false, message: "Already enrolled in this course" })
      }

      student.courses.push({ courseId, title, adminId, adminName, image });
    }

    await student.save();
    return res
      .status(200)
      .json({ success: true, message: "Course enrolled successfully" });
  } catch (error) {
    console.error("Enroll error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while enrolling" });
  }
};

export const getCoursesByStudentId = async (req, res) => {
  try {
    const { id } = req.params;
    const studentEnrollCourses = await studentCourse.findOne({ userId: id });

    if (!studentEnrollCourses) {
      return res.status(404).json({
        success: false,
        message: "No courses enrollment found",
      });
    }


    const enrichedCourses = await Promise.all(
      studentEnrollCourses.courses.map(async (course) => {
        const courseData = await Course.findById(course.courseId);
        const progress = await CourseProgress.findOne({
          userId: id,
          courseId: course.courseId,
        });

        const totalLectures = courseData?.curriculum?.length || 0;
        const viewedLectures =
          progress?.lectureProgress?.filter((l) => l.viewed)?.length || 0;

        const completionPercentage =
          totalLectures === 0
            ? 0
            : Number(((viewedLectures / totalLectures) * 100).toFixed(2));

        return {
          ...course.toObject?.() || course,
          completionPercentage,
          completed: progress?.completed || false,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enrichedCourses,
    });
  } catch (error) {
    console.error("Error fetching student courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching student courses",
    });
  }
};

// export const getCoursesByStudentId = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const studentEnrollCourses = await studentCourse.findOne({ userId: id });

//     if (!studentEnrollCourses) {
//       return res.status(404).json({
//         success: false,
//         message: "No courses enrollment found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: studentEnrollCourses.courses,
//     });
//   } catch (error) {
//     console.error("Error fetching student courses:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error while fetching student courses",
//     });
//   }
// };
