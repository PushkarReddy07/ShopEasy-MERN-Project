import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendemail.js";
import crypto from 'crypto'
import bcryptjs from "bcryptjs";

export const registerUser = handleAsyncError(async(req , res , next) => {
    const {name,email,password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar :{
            public_id:"This is temp id",
            url:"This is temp url"
        }
    })
    sendToken(user , 200 , res);
})

//Login Functionality
export const loginUser = handleAsyncError(async(req,res,next) => {
    const {email , password} = req.body;
    if(!email || !password ){
        return next(new HandleError("Email or password cannot be empty" , 400 ));
    }
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new HandleError("Invalid Email or Password" , 401))
    }
    const isPasswordValid = await user.verifyPassword(password)
    if (!isPasswordValid) {
        return next(new HandleError("Invalid Email or Password", 401));
    }
    sendToken(user , 200 , res);
})

//Logout Function
export const logout = handleAsyncError(async (req,res,next) => {
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Successfully Logged out"
    })
})

//Forgot password(Email)
export const requestPasswordReset = handleAsyncError(async(req , res , next) => {
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new HandleError("User doesn't exist" , 400));
    }
    let resetToken;
    try{
        resetToken = user.generatePasswordResetToken()
        // console.log(resetToken);
        await user.save({validateBeforeSave:false})
    }catch(err){
        //console.log(err.message)
        return next(new HandleError("Could not save reset token, Please try again!" ,500))
    }
    const resetPasswordURL = `http://localhost/api/v1/reset/${resetToken}`;
    // console.log(resetPasswordURL);
    const message = `Use the following link tio reset your Password : ${resetPasswordURL}\n\n This link will expire in 5 minutes.\n\nIf you didn't request a password request,please ignore this message`
    try{
        await sendEmail({
            email:user.email,
            subject:'Password reset request',
            message
        })
        res.status(200).json({
            success:true,
            message:`email is successfully sent to ${user.email} if it exists!!`
        })
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false})
        return next(new HandleError("Email could not be sent,Please try again later" , 500))
    }
})

//Reset Password
export const resetPassword = handleAsyncError(async(req,res,next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({resetPasswordToken
        , resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new HandleError("Password Token might have expired or invalid" , 400))
    }
    const {password,confirmPassword}  = req.body;
    if(password !== confirmPassword){
        return next(new HandleError("Passwords must match!!!" , 400))
    }
    user.password = password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()
    sendToken(user,200,res);
})

//get user details
export const getUsersDetails=handleAsyncError(async (req,res ,next) => {
    // const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true ,
        user : req.user
    })

})

//Update Password
export const updatePassword = handleAsyncError(async(req,res,next) => {
    const {oldPassword,newPassword,confirmPassword} = req.body;
    const user = await User.findById(req.user.id).select('+password');
    const checkPasswordMatch = await user.verifyPassword(oldPassword);
    if(!checkPasswordMatch){
        return next(new HandleError("Old Password is incorrect, Please try again Later !!" , 400))
    }
    if(newPassword !== confirmPassword){
       return next(new HandleError("Password's doesn't match!!",400));
    }
    user.password = newPassword;
    await user.save()
    sendToken(user,200,res);
})

//Updating userProfile
export const updateProfile = handleAsyncError(async(req,res,next) => {
    const {name,email} = req.body
    const UpdateUserDetails = {
        name,
        email
    }
    const user = await User.findByIdAndUpdate(req.user.id,UpdateUserDetails,{
        returnDocument: 'after',
        runValidators:true
    })
    res.status(200).json({
        success:true,
        message:"Profile Updated Successfully",
        user
    })

})

//Admin - Gatting all USers List
export const getUsersList = handleAsyncError(async(req,res,next) => {
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })
})

//Admin accessing single user data
export const getSingleUser = handleAsyncError(async(req,res,next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new HandleError(`User doesn't exist with this ${req.params.id}`,400))
    }
    res.status(200).json({
        success:true,
        user
    })
})

//Admin changing User role
export const updateUserRole = handleAsyncError(async(req,res,next) => {
    const {role} = req.body;
    const newUserData = {
        role
    }
    if(req.user.id === req.params.id){
        return next(new HandleError('You cannot change your own role'),400)
    }
    const user = await User.findByIdAndUpdate(req.params.id,newUserData , {
        returnDocument: "after",
        runValidators:true
    })
    if(!user){
        return next(new HandleError(`User doesn't exist`,400))
    }
    res.status(200).json({
        success:true,
        user
    })
})

//Delete User Profile
export const deleteUser = handleAsyncError( async(req,res,next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new HandleError("User doesn't exist" , 400));
    }
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
})

//