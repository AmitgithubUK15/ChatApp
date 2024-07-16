const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors")
const cookieParser = require("cookie-parser");
const {createServer} = require("http");
const {Server} = require("socket.io");
const {app,server,io} = require("./Socket/socket.js");

// routers
const UserRouter = require("./Routes/User.route.js")

dotenv.config();
const port = process.env.PORT || 3000;


app.use(cors({ origin: process.env.CLIENT_SOCKET_URL, methods: ["GET", "POST"], credentials: true }));
app.use(cookieParser());

mongoose.connect(process.env.URI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((error)=>{
    console.log(error);
})


  server.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });



app.use("/api",UserRouter);



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});



