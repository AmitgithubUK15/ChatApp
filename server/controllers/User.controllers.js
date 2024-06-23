const User = require("../models/User.model.js")

async function SignupUser(req,next){
  try {
    const user = await User({
     username:req.username,
     email:req.email,
     password:req.password
    })

    if(!user) return "user not create";

    const process = await user.save();
    return process;
  } catch (error) {
    console.log(error)
    return error
  }
}


async function GetAllUser(){
  try {
    const findall = await User.find();
    if(!findall)  return "user not found";

    return findall;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = {
    SignupUser,
    GetAllUser
}