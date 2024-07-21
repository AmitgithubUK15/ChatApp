const mongoose = require("mongoose");

const ChatingList = mongoose.Schema({
    user:{
        type:String,
        required:true,
        unique:true,
    },
    ConnectedUser:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
        }
    ]
});


const  Chatlist = mongoose.model("UserChatlist",ChatingList);

module.exports = Chatlist;


