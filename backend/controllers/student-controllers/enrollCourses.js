import studentCourse from "../../models/studentCourses.js"

export const enrollCourse = async (req, res) => {
try {
  const { userId, courseId, title, adminId, adminName, image } = req.body
  // console.log(userId, courseId,title,adminId,adminName, image)
  // console.log(req.body)


  let student = await studentCourse.findOne({ userId })

  if (!student) {
    
    student = new studentCourse({
      userId,
      courses: [{ courseId, title, adminId, adminName, image }]
    })

    
  } else {
    const alreadyEnrolled = student.courses.some(c => c.courseId === courseId)
    if (alreadyEnrolled) {
      // return res.status(409).json({ success: false, message: "Already enrolled in this course" })
    }

    
    student.courses.push({ courseId, title, adminId, adminName, image })
  }

  await student.save()
  return res.status(200).json({ success: true, message: "Course enrolled successfully" })

} catch (error) {
  console.error("Enroll error:", error)
  return res.status(500).json({ success: false, message: "Server error while enrolling" })
}
}


export const getCoursesByStudentId = async (req, res) => {
  try {
    const { id } = req.params
    // console.log(id)
    const studentEnrollCourses = await studentCourse.findOne({ userId: id })

    if (!studentEnrollCourses) {
      return res.status(404).json({
        success: false,
        message: "No courses enrollment found",
      })
    }

    return res.status(200).json({
      success: true,
      data: studentEnrollCourses.courses,
    })
  } catch (error) {
    console.error("Error fetching student courses:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching student courses",
    })
  }
}
