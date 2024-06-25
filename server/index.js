const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const {graphqlHTTP} = require("express-graphql");
const cors = require("cors")
const cookieParser = require("cookie-parser");

// routers
const UserRouter = require("./Routes/User.route.js")

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(cookieParser());

mongoose.connect(process.env.URI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((error)=>{
    console.log(error);
})


app.use((req,res,next)=>{
    req.user = {role:'admin'}
    next();
})

app.use("/api",UserRouter)




app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(port,()=>{
    console.log(`Server is connected at port ${port}`)
})

