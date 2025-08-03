import { generateRecommendationsForUser } from "../../services/index.js";
import Recommendation from "../../models/recommendation.js";
import Course from "../../models/Course.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    await generateRecommendationsForUser(userId);

    const recommendationData = await Recommendation.findOne({ userId });

    if (!recommendationData || !recommendationData.recommendationCourses || recommendationData.recommendationCourses.length === 0) {
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

    const personalizationScores = new Map(
      recommendationData.recommendationCourses.map(rec => [rec.courseId.toString(), rec.personalizationScore])
    );

    const courseIds = recommendationData.recommendationCourses.map(course => course.courseId);
    const courses = await Course.find({
      _id: { $in: courseIds },
      averageRating: { $gte: 3.5 }, 
    });

    const recommendations = courses.map(course => {
      const personalizationScore = personalizationScores.get(course._id.toString()) || 0;
      const combinedRank = (personalizationScore * 0.5) + (course.averageRating * 0.5);
      return {
        courseId: course._id,
        title: course.title,
        image: course.image,
        averageRating: course.averageRating,
        combinedRank,
      };
    }).sort((a, b) => b.combinedRank - a.combinedRank);

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    console.log("Error in getRecommendations:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
