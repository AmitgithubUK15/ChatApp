const Messages = require("../models/Messages.model.js");
const Room = require("../models/Room");
const { io, ActiveUserMap } = require("../Socket/socket");

async function AddUserForChat(args) {

  const { senderId, reciverID, msg,Date,Time,Day } = args;
  const reciversocket = ActiveUserMap.get(args.reciverID);

  
  const conversation = await Room.findOne({
    Participant:{$all :[senderId,reciverID]}
  });

  
  const messages = await Messages({
    senderId:senderId,
    reciverID:reciverID,
    msg:msg,
    Date:Date,
    Time:Time,
    Day:Day
  })

  await messages.save();

  if (!conversation) {
 
    const createRoom = new Room({
      Participant: [senderId, reciverID ],
      messages: [messages._id], // Initialize messages as an array
    });

    const process = await createRoom.save();
  } else {
    conversation.messages.push(messages._id);
    await conversation.save();

  }

  io.to(reciversocket).emit("chatmessage", {
    msg: messages.msg,
    senderId:messages.senderId,
    Time:messages.Time
  });

  return {ChatMsg: messages };
}

module.exports = {
  AddUserForChat,
};
