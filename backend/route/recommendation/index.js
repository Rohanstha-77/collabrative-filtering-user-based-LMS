import express from "express"
import { getRatings, storeRating } from "../../controllers/recommendation/rating.js"
import { getRecommendations } from "../../controllers/recommendation/recommendation.js"

const router = express.Router()

router.post("/postrating", storeRating)
router.get("/getrating/:courseId/:userId", getRatings)
router.get("/getrecommendation/:userId", getRecommendations)

export default router