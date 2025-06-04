import { generateRecommendationsForUser } from "../../services/index.js";
import Recommendation from "../../models/recommendation.js";
import Course from "../../models/Course.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Generate recommendations using combined rating + progress vectors
    await generateRecommendationsForUser(userId);

    // Fetch stored recommendations
    const data = await Recommendation.findOne({ userId });

    if (!data || !data.recommendationCourses || data.recommendationCourses.length === 0) {
      // Cold start fallback: recommend popular courses with high rating
      const popularCourses = await Course.find({ averageRating: { $gte: 4.0 } })
        .sort({ averageRating: -1 })
        .limit(10);

      return res.status(200).json({
        success: true,
        message: "No personalized recommendations yet. Showing popular courses.",
        data: popularCourses.map(course => ({
          courseId: course._id,
          title: course.title,
          image: course.image,
          averageRating: course.averageRating
        })),
      });
    }

    // Filter recommended courses by minimum rating threshold
    const courseIds = data.recommendationCourses.map(course => course.courseId);
    const courses = await Course.find({
      _id: { $in: courseIds },
      averageRating: { $gte: 3.5 }, // filter out bad courses
    }).sort({ averageRating: -1 });

    // Return clean recommendations payload
    const recommendations = courses.map(course => ({
      courseId: course._id,
      title: course.title,
      image: course.image,
      averageRating: course.averageRating,
    }));

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
