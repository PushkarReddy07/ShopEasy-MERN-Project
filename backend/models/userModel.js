import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt'
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

userSchema.pre("save" , async function() {
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10)
})
export default mongoose.model("User",userSchema)