import mongoose from "mongoose";
import validator from 'validator';
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[
            true,"Please Enter your name"
        ],
        maxLength:[25,"Invalid name .Please enter a name with less than 26 chars"],
        minLength:[3 , "Name Should contain more than 3 characters"]
    },
    email :{
        type:String,
        required:[
            true,"Please Enter Your Email"
        ],
        unique:true,
        validate:[validator.isEmail,"Please Enter valid Email"],
    },
    password:{
        type:String,
        // cast:false,
        required:[true , "Please Enter your password"],
        minLength:[8,"password should contain more than 8 chars"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire : Date
},{timestamps:true})

userSchema.pre("save" , async function(){
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcryptjs.hash(this.password,10); 
})

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id} , process.env.JWT_SECRET_KEY ,{
        expiresIn : process.env.JWT_EXPIRE
    })
}
userSchema.methods.verifyPassword = async function(userEnteredPassword) {
    return await bcryptjs.compare(userEnteredPassword,this.password);
}
userSchema.methods.generatePasswordResetToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken =  crypto.createHash("sha256").update(resetToken).digest('hex');
    this.resetPasswordExpire = (Date.now()+(30*60*1000)) // millisecs since Jan 1 1970 UTC
    return resetToken;
}
export default mongoose.model("User",userSchema)