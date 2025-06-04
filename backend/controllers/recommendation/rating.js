import  rating from "../../models/courseRating.js"
import Course from "../../models/Course.js"
import User from "../../models/user.js"

export const storeRating = async (req, res) => {
    const { userId, courseId, rate } = req.body;

    if (!userId || !courseId || rate === undefined) {
        return res.status(200).json({ success: false, message: "Missing userId, courseId, or rate." });
    }

    try {
        const existingRating = await rating.findOne({ userId, courseId });

        if (existingRating) {
            existingRating.rating = rate;
            await existingRating.save();
        } else {
            const newRating = new rating({
                userId,
                courseId,
                rating: rate
            });
            await newRating.save();
        }

        // Updating course average and total ratings
        const ratings = await rating.find({ courseId });

        const totalRating = ratings.length;
        let averageRating = 0;

        if (totalRating !== 0) {
            averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRating;
        }

        await Course.findByIdAndUpdate(courseId, {
            averageRating,
            totalRating
        });

        return res.status(200).json({ success: true, message: "Rating submitted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "An error occurred while saving the rating." });
    }
};



export const getRatings = async (req, res) => {
    const { courseId, userId } = req.params

    console.log(courseId, userId)

    // Check courseId or userId is provided or not
    if (!courseId || !userId) {
      return res.status(200).json({ success: false, message: "Course ID and User ID are required." });
    }

    try {
      // Find the rating for the courseId and userId
      const existingRating = await rating.findOne({ courseId, userId });

      if (!existingRating) {
        // If the user has not rated the course
        return res.status(200).json({ success: false, message: "User has not rated this course yet." });
      }

      // Fetch user data (if needed, you can add more fields to the user query)
      const user = await User.findById(userId);

      // Prepare the response with rating and user data
      const ratingWithUser = {
        rating: existingRating.rating,
        user: user ? { name: user.name, email: user.email } : null,
      };

      return res.status(200).json({ success: true, data: ratingWithUser });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "An error occurred while fetching the rating." });
    }
};

  