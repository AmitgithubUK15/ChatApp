const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema({
   Participant: {
    type:Array,
    required: true
   },
   messages:[
       {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Messages",
         required:true,
        }
   ]
},{timestamps:true})

const Room = mongoose.model('ChatingRoom',RoomSchema);

module.exports = Room;