import User from "../../models/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async(req,res) => {
    const {username,email,password, role} = req.body
    // console.log(req.body)

    const existingUser = await User.findOne({$or: [{username,email}]})

    if(existingUser) return res.status(200).json({
        success: false,
        message: 'username or email already exists'
    })

    const hasedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
        username :username ,email: email,password:hasedPassword,role
    })

    await newUser.save()

    return res.status(200).json({
        success: true,
        message: 'user registered sucessfully'
    })

}

export const loginUser = async(req,res) => {
    const {email,password} = req.body.formData
    // console.log(req.body.formData)
    // console.log(req.headers.authorization)
    // console.log(req.user)

    const checkUser = await User.findOne({email:email})

    if(!checkUser) return res.status(200).json({
        success: false,
        message: "Invalid Credentials"
    })

    const comparePassword = await bcrypt.compare(password, checkUser.password)
    if(!comparePassword) return res.status(200).json({
        success: false,
        message: "Invalid Credentials"
    })

    const accessToken = jwt.sign({
        _id: checkUser._id,
        username: checkUser.username,
        email: checkUser.email,
        role: checkUser.role
    },process.env.JWT_SECRECT_KEY,{expiresIn: '7d'})

    res.status(200).json({
        success: true,
        message: "Login Sucessfully",
        data: {
            accessToken,
            user: {
                _id: checkUser._id,
                username: checkUser.username,
                email: checkUser.email,
                role: checkUser.role
            }
        }
    })
} 