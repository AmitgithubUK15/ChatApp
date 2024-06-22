const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const {graphqlHTTP} = require("express-graphql");


dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

mongoose.connect(process.env.URI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((error)=>{
    console.log(error);
})

app.get("/",(req,res)=>{
    console.log("hello");
})

app.listen(port,()=>{
    console.log(`Server is connected at port ${port}`)
})
