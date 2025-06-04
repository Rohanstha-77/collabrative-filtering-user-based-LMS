import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
})

const User = mongoose.model("User", UserSchema)
export default User