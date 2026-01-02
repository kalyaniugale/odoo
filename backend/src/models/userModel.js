import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
	googleId: String,
    role:{
        type:String,
        enum:["Role-1","Role-2"],
		default: "Role-1",
        required:true
    },
    photoUrl:{
        type:String,
        default:""
    }
},{timestamps:true})


const User = mongoose.model("User",userSchema)

export default(User);