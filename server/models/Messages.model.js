const mongoose = require("mongoose");

const MessagesSchema = mongoose.Schema({
    senderId:{
        type:String,
        required:true
    },
    reciverID:{
        type:String,
        required:true
    },
    msg:{
        type:String,
        default:"",
    },
    FileMsg:{
        type:Array,
        default:{
            filename: "",
            size: "",
            type:"",
            url:""
        }
    },
    Date:{
     type:String,
     required:true
    },
    Time:{
       type:String,
       required:true
    },
    Day:{
    type:String,
    required:true
   }
})

const Messages = mongoose.model("Messages",MessagesSchema);

module.exports = Messages;

