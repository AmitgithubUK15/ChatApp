const { errorHandler } = require("../utils/autherror");
const {InternalServerError} = require("../utils/error");
const {getUser} = require("../utils/verifyUser");

const jwt = require("jsonwebtoken")

async function restrictToLoggedinUserOnly(context){

    const token = context.req.cookies.token;
    // const token = context.req.rawHeaders[15];
    if(!token)  throw new Error("Session Expired, please login");
    const user = getUser(token);

    if(!user) throw new Error("Session Expired, please login");
    try {
        const decoded = jwt.verify(token,process.env.JWT_PASS_KEY);
        
        context.user = { ...context.user, ...decoded }; 
    } catch (err) {
        throw new Error("Session Expired, please login again");
    }
}


module.exports = {
 restrictToLoggedinUserOnly,
}