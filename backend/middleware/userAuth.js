import HandleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from 'jsonwebtoken'
import User from "../models/userModel.js";


export const verifyUserAuth = handleAsyncError( async(req ,res , next ) => {
    const { token } = req.cookies
    console.log(token)
    if(!token){
        return new HandleError(`Authentication is missing , Please Login to continue` , 401)
    }
    const decodeData = jwt.verify(token , process.env.JWT_SECRET_KEY)
    console.log(decodeData);
    req.user = await User.findById(decodeData.id);
    next();
})