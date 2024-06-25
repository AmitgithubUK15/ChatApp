const User = require("../models/User.model.js");
const { InternalServerError } = require("../utils/error.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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

async function Signin(req,res){
  const {email,password} = req;

  try {
     const user = await User.findOne({email});
     
     if(!user)  throw new InternalServerError("Wrong Credential"); 
     
     const checkPassword = await bcrypt.compare(password, user.password);
   
    if (!checkPassword) {
      throw new InternalServerError("Wrong Password");
    }

    const token = jwt.sign({id:user._id},process.env.JWT_PASS_KEY)
     const {password:pass, ...rest} = user._doc;
     res.cookie('token',token,{httpOnly:true});

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