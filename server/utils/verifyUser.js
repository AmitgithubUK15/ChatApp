const jwt = require("jsonwebtoken");
const {InternalServerError} = require("./error")


function setUser(user){
    return jwt.sign({
        id:user._id
    },process.env.JWT_PASS_KEY)
}

function getUser(token){
   if(!token) return null;
   try {
    return jwt.verify(token,process.env.JWT_PASS_KEY)
   }    
   catch (error) {
     return null
   }
}


module.exports = {
    setUser,
    getUser
}