import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    photoURL:{
        type: String,
        default:""
    },
    role:{
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    passwordResetOtpHash: {
        type: String,
        select: false,
    },
    passwordResetOtpExpires: {
        type: Date,
        select: false,
    },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;