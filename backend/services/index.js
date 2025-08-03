import Rating from "../models/courseRating.js";
import CourseProgress from "../models/courseProgress.js";
import Course from "../models/Course.js";
import Recommendation from "../models/recommendation.js";
import { cosineSimilarity } from "../utils/similarity.js";

export async function generateRecommendationsForUser(userId) {
  // Fetch all ratings and progress
  const ratings = await Rating.find();
  const progressRecords = await CourseProgress.find();

  //remove duplicate id 
  const userIds = new Set([...ratings.map(r => r.userId), ...progressRecords.map(p => p.userId)]);
  const courseIds = new Set([...ratings.map(r => r.courseId), ...progressRecords.map(p => p.courseId)]);

  const allUserIds = Array.from(userIds);
  const allCourseIds = Array.from(courseIds);

  // user course interaction vector rating and course completion
  const userVectors = {};

  for (const uid of allUserIds) {
    userVectors[uid] = allCourseIds.map(cid => {
      // Rating
      const ratingEntry = ratings.find(r => r.userId === uid && r.courseId === cid);
      const ratingScore = ratingEntry ? ratingEntry.rating : 0;

      const progressEntry = progressRecords.find(p => p.userId === uid && p.courseId === cid);
      let completionScore = 0;

      if (progressEntry) {
        if (progressEntry.completed === "true" || progressEntry.completed === true) {
          completionScore = 5; // max score for completion
        } else if (progressEntry.lectureProgress && progressEntry.lectureProgress.length) {
          const totalLectures = progressEntry.lectureProgress.length;
          const viewedLectures = progressEntry.lectureProgress.filter(lp => lp.viewed).length;
          completionScore = (viewedLectures / totalLectures) * 5;
        }
      }

      const combinedScore = (ratingScore * 0.7) + (completionScore * 0.3);

      return combinedScore;
    });
  }

  const targetVector = userVectors[userId];
  if (!targetVector) return;

  console.log("Target User ID:", userId);
  console.log("Target User Vector:", targetVector);

  // similarity with other users
  const similarities = [];
  for (const uid of allUserIds) {
    if (uid !== userId) {
      const sim = cosineSimilarity(targetVector, userVectors[uid]);
      similarities.push({ uid, sim });
    }
  }
  console.log("All User Similarities:", similarities);

  similarities.sort((a, b) => b.sim - a.sim);
  const topSimilarUsers = similarities.slice(0, 5);


  const recommendedCourses = new Map();

  for (const { uid } of topSimilarUsers) {
    allCourseIds.forEach((cid, i) => {
      const interactionScore = userVectors[uid][i];
      if (targetVector[i] === 0 && interactionScore >= 3.5) {
        const existingScore = recommendedCourses.get(cid) || 0;
        recommendedCourses.set(cid, existingScore + interactionScore);
      }
    });
  }


  const finalCourses = await Course.find({ _id: { $in: Array.from(recommendedCourses.keys()) } });


  await Recommendation.findOneAndUpdate(
    { userId },
    {
      userId,
      recommendationCourses: finalCourses.map(course => ({
        courseId: course._id,
        title: course.title,
        image: course.image,
        personalizationScore: recommendedCourses.get(course._id.toString()), // calculated score
      })),
    },
    //create a new doc of data doesnt exist
    { upsert: true }
  );
}
