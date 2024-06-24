const User = require("../models/User.model.js");
const { errorHandler } = require("../utils/error.js");

async function SignupUser(req,next){
  try {
    const user = await User({
     username:req.username,
     email:req.email,
     password:req.password
    })

    if(!user) return next(errorHandler(500,"User not created"))

    const process = await user.save();
    return process;
  } catch (error) {
    console.log(error)
    next(error);
  }
}


async function GetAllUser(){
  try {
    const findall = await User.find();
    if(!findall)  return  next(errorHandler(500,"Users not found"))

    return findall;
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
    SignupUser,
    GetAllUser
}