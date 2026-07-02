import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

userSchema.pre("save" , async function(next) {
    this.password = await bcrypt.hash(this.password,10)
    if(!this.isModified("password")){
        return next();
    }
    
})

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id} , process.env.JWT_SECRET_KEY ,{
        expiresIn : process.env.JWT_EXPIRE
    })
}
userSchema.methods.verifyPassword = async function(userEnteredPassword) {
    return await bcrypt.compare(userEnteredPassword,this.password);
}
export default mongoose.model("User",userSchema)