import express from 'express'
import { loginUser, registerUser } from '../../controllers/auth-controller/index.js'
import { authenticate } from '../../middleware/auth.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/checkauth', authenticate,(req,res) => {
    const user = req.user
    // console.log(user)
    res.status(200).json({
        success: true,
        message: "Authenticate User",
        data: {
            user
        }
    })
})


export default router