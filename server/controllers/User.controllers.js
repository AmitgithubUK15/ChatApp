const User = require("../models/User.model.js");
const { InternalServerError } = require("../utils/error.js");
const bcrypt = require("bcrypt");


async function SignupUser(req,next){

  const hashpassword = await bcrypt.hash(req.password,8);
  try {
    const user = await User({
     username:req.username,
     email:req.email,
     password:hashpassword
    })

    const process = await user.save();

    if(!process) throw new InternalServerError("User not created");
    
    const {password:pass, ...rest} = user._doc;
    return {msg:"User created successfully",candidate:rest};
  } catch (error) {
   
    throw new InternalServerError(error.message || "Internal server error");
  }
}


async function GetAllUser(){
  try {
    const findall = await User.find();
    if(!findall) throw new InternalServerError("Users not found"); 

    return findall;
  } catch (error) {
    console.log(error);
    if(!findall) throw new InternalServerError("Users not found"); 
  }
}

async function Signin(req){
  const {email,password} = req;
  console.log(req)
  try {
     const user = await User.findOne({email});
     console.log(user);
     if(!user)  throw new InternalServerError("Wrong Credential"); 
     
     const checkPassword = await bcrypt.compare(password, user.password);
   
    if (!checkPassword) {
      throw new InternalServerError("Wrong Password");
    }
     const {checkpassword:pass, ...rest} = user._doc;

     return {msg:"Login successfull",candidate:rest};
  } catch (error) {
    console.log(error);
    throw new InternalServerError(error.message || "Internal server error");
  }
}

module.exports = {
    SignupUser,
    GetAllUser,
    Signin
}