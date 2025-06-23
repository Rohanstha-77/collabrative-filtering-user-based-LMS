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

  // Build user-course interaction vectors combining rating + completion score or completion
  const userVectors = {};

  for (const uid of allUserIds) {
    userVectors[uid] = allCourseIds.map(cid => {
      // Rating (explicit feedback)
      const ratingEntry = ratings.find(r => r.userId === uid && r.courseId === cid);
      const ratingScore = ratingEntry ? ratingEntry.rating : 0;

      // Completion progress 
      const progressEntry = progressRecords.find(p => p.userId === uid && p.courseId === cid);
      let completionScore = 0;

      if (progressEntry) {
        // if course is completed or by course progress 
        // Example: completed = 1, course progress between 0 and 1, scaled to 0-5
        if (progressEntry.completed === "true" || progressEntry.completed === true) {
          completionScore = 5; // max score for completion
        } else if (progressEntry.lectureProgress && progressEntry.lectureProgress.length) {
          const totalLectures = progressEntry.lectureProgress.length;
          const viewedLectures = progressEntry.lectureProgress.filter(lp => lp.viewed).length;
          completionScore = (viewedLectures / totalLectures) * 5;
        }
      }

      //combine the two score i.e rating and completion
      const combinedScore = (ratingScore * 0.7) + (completionScore * 0.3);

      return combinedScore;
    });
  }

  const targetVector = userVectors[userId];
  if (!targetVector) return; // no data for user, fallback handled

  // similarity with other users
  const similarities = [];
  for (const uid of allUserIds) {
    if (uid !== userId) {
      const sim = cosineSimilarity(targetVector, userVectors[uid]);
      similarities.push({ uid, sim });
    }
  }

  similarities.sort((a, b) => b.sim - a.sim);
  const topSimilarUsers = similarities.slice(0, 5);

  // Recommend courses highly rated or completed by similar users but not by target user
  const recommendedCourses = new Set();

  for (const { uid } of topSimilarUsers) {
    allCourseIds.forEach((cid, i) => {
      if (targetVector[i] === 0 && userVectors[uid][i] >= 4) {
        recommendedCourses.add(cid);
      }
    });
  }

  // Fetch course details for recommendations
  const finalCourses = await Course.find({ _id: { $in: Array.from(recommendedCourses) } });

  // Save/update recommendations
  await Recommendation.findOneAndUpdate(
    { userId },
    {
      userId,
      recommendationCourses: finalCourses.map(course => ({
        courseId: course._id,
        title: course.title,
        image: course.image,
      })),
    },
    //create a new doc of data doesnt exist
    { upsert: true }
  );
}
