const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/interview").then((e)=>{
    console.log("connect toi mongodb")
})

const userSchema = new mongoose.Schema({
    name:{
        type: String,
    required:true},
    username:{
        type: String,
    required:true},
    password:{
        type: String,
    required:true},
    otp:String,
    status:String
    
})

exports.UserData = new mongoose.model("UserData", userSchema)