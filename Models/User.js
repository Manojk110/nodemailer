const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    city:{
        required:true,
        type:String
    },  
    email:{
        required:true,
        type:String
    },
    contact:{
        required:true,
        type:String
    },
    image:{
        required:true,
        type:String
    }
})
module.exports=mongoose.model("User",userSchema)