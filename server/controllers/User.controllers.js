const User = require("../models/User.model.js");
const { InternalServerError } = require("../utils/error.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { setUser } = require("../utils/verifyUser.js");


async function GoogleAuth(req){


  try {
    const user = await User.findOne({email:req.email});

     if(user){
      const token = setUser(user);
      const {password: pass,...rest} = user._doc;
      
      return {msg:"Login successfull",candidate:rest,token:token};
     }
     else{
      const GeneratePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedpassword = await bcrypt.hash(GeneratePassword,8);
     
      const newUser = await User({
        username:req.username,
        email:req.email,
        password:hashedpassword,
        avatar:req.avatar
       })
   
        await newUser.save();
   
       if(!newUser) throw new InternalServerError("User not created");
       
       const token = setUser(newUser);
       const {password:pass, ...rest} = newUser._doc;
       return {msg:"Login successfull",candidate:rest,token:token};
     }
  } catch (error) {
   
    throw new InternalServerError(error.message || "Internal server error");
  }
}


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

    const token = jwt.sign({id:user._id},process.env.JWT_PASS_KEY,{ expiresIn: '1h' })   
      
    const {password:pass, ...rest} = user._doc;

    //  res.cookie('token',token,{httpOnly:true});

     return {msg:"Login successfull",candidate:rest,token:token};
  } catch (error) {
   
    throw new InternalServerError(error.message || "Internal server error");
  }
}


async function updateprofile_pic(req){
  const {req_details} = req;

  try {

    // const finduser = await User.findOne({_id:req_details.user_id});
    const FindUserandUpdate = await User.findOneAndUpdate(
      {_id:req_details.user_id},
      {$set: {avatar: req_details.image}},
      {new:true}
    )
     
    if(!FindUserandUpdate)  throw new InternalServerError('Failed to update profile');

    const {password:pass,...rest} = FindUserandUpdate._doc;
  
    return {msg:"Profile update successfully",candidate:rest}
  } catch (error) {
    throw new InternalServerError(error.message || "Internal server error");
  }
}


async function Update_userName(args){
  const {user_id,updated_name} = args;
  
  try {
     const FindUserandUpdate = await User.findOneAndUpdate(
      {_id:user_id},
      {
        $set:{
          username:updated_name
        }
      },
      {new:true},
    )

    if(!FindUserandUpdate)  throw new InternalServerError('Failed to update username');

    const {password:pass,...rest} = FindUserandUpdate._doc;
  
    return {msg:"Username update successfully",candidate:rest};
  } catch (error) {
    throw new InternalServerError(error.message || "Internal server error");
  }
}


async function update_user_about(args){
  const {user_id,updated_about} = args;
  
  
  try {
     const FindUserandUpdate = await User.findOneAndUpdate(
      {_id:user_id},
      {
        $set:{
          about:updated_about
        }
      },
      {new:true},
    )

    if(!FindUserandUpdate)  throw new InternalServerError('Failed to update about');

    const {password:pass,...rest} = FindUserandUpdate._doc;
  
    return {msg:"User About update successfully",candidate:rest};
  } catch (error) {
    throw new InternalServerError(error.message || "Internal server error");
  }
}

module.exports = {
    GoogleAuth,
    GetAllUser,
    Signin,
    SignupUser,
    updateprofile_pic,
    Update_userName,
    update_user_about
}