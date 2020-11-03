const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userSchema=new Schema({
    username:String,
    email:String,
    password:String,
    active:Boolean,
    time_created:Date
})


const userModel=mongoose.model('userModel',userSchema)
module.exports =userModel