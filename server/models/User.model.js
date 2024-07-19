const mongoose = require("mongoose");


const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    Rooms:{
        type:Array,
    },
    avatar:{
        type:String,
        default:'https://i.pinimg.com/originals/29/b8/d2/29b8d250380266eb04be05fe21ef19a7.jpg',
    }
    
},{timestamps:true})

const User = mongoose.model('user',UserSchema);

module.exports = User;




