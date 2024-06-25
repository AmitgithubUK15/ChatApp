const { errorHandler } = require("../utils/autherror");
const {InternalServerError} = require("../utils/error");
const {getUser} = require("../utils/verifyUser");
const jwt = require("jsonwebtoken")

async function restrictToLoggedinUserOnly(req,res,next){
    const token = req.cookies.token;

    if(!token) return next(errorHandler(500,"Authorization failed please login"))
    const user = getUser(token);

    if(!user)return next(errorHandler(500,"Authorization failed please login"))

    try {
        const decoded = jwt.verify(token,process.env.JWT_PASS_KEY);
        
        next();
    } catch (err) {
         throw new InternalServerError(err.message,"Authorization failed please login");
    }
}


module.exports = {
 restrictToLoggedinUserOnly,
}