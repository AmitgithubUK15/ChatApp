const express = require("express");
const dotenv = require("dotenv");


dotenv.config();
const port = process.env.PORT || 3000;
const app = express();


app.get("/",(req,res)=>{
    console.log("hello");
})

app.listen(port,()=>{
    console.log(`Server is connected at port ${port}`)
})
