const Chatlist = require("../models/ChatList.model.js");
const Messages = require("../models/Messages.model.js");
const Room = require("../models/Room");
const { io, ActiveUserMap } = require("../Socket/socket");
const { InternalServerError } = require("../utils/error.js");

async function AddUserForChat(args) {

 
try {
  const { senderId, reciverID, msg,Date,Time,Day ,FileMsg} = args;
  const reciversocket = ActiveUserMap.get(args.reciverID);

  
  const conversation = await Room.findOne({
    Participant:{$all :[senderId,reciverID]}
  });

  
  const messages = await Messages({
    senderId:senderId,
    reciverID:reciverID,
    msg:msg,
    FileMsg:FileMsg,
    Date:Date,
    Time:Time,
    Day:Day
  });

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
    FileMsg:messages.FileMsg,
    senderId:messages.senderId,
    Time:messages.Time
  });


  //   // for sender UserChatList
  
  const ChatListUsers = await Chatlist.findOne({
    user:senderId,
  })
  if(!ChatListUsers){
    const createChatList = new Chatlist({
      user:senderId,
      ConnectedUser:[reciverID]
    })

    await createChatList.save();
  }
  else{
    // Check if reciverID is already in the ConnectedUser array
  const isUserConnected = ChatListUsers.ConnectedUser.includes(reciverID);

  if (!isUserConnected) {
    ChatListUsers.ConnectedUser.push(reciverID);
    await ChatListUsers.save();
  } else {
    console.log("User is already in the connected user list.");
  }
  }


  // for reciver UserChatList
  const ChatListforreciver = await Chatlist.findOne({
    user:reciverID,
  })

  if(!ChatListforreciver){
    const createChatList = new Chatlist({
      user:reciverID,
      ConnectedUser:[senderId]
    })

    await createChatList.save();
  }
  else{
    const isUserConnected = ChatListforreciver.ConnectedUser.includes(senderId);
    if (!isUserConnected) {
      ChatListforreciver.ConnectedUser.push(senderId);
      await ChatListforreciver.save();
    } else {
      console.log("User is already in the connected user list.");
    }
  }

  return {ChatMsg: messages };
} catch (error) {
  throw new InternalServerError(error.message || "Internal server error");
}
}



 function CheckOnlineUser(args){
  const {user_id} = args;
 
  try {
  
    const check = ActiveUserMap.get(user_id);

    if(check !== null && check !== undefined){
      return {msg:true}
    }
    else{
      return {msg:false}
    }
  } catch (error) {
    throw new InternalServerError(error.message || "Internal server error");
  }
}

async function ChatingUser(args){
  const {sender} = args;

  try {
    const FindRoom = await Chatlist.findOne({
      user:sender
    }).populate("ConnectedUser")

    if(!FindRoom)  throw new InternalServerError(error.message || "Internal server error");
    
  
    return {List:FindRoom};
  } catch (error) {
    throw new InternalServerError(error.message || "Internal server error");
  }
}


async function  Getusermsg(args){
  const {senderId,reciverID} = args;
  try {
    const FindUserRoom = await Room.findOne({
      Participant : {$all :[senderId,reciverID]}
    }).populate("messages");

    if(!FindUserRoom) throw new InternalServerError("Users not found");
    return FindUserRoom;
  } catch (error) {
    throw new InternalServerError(error.message || "Internal server error");
  }
}


async function deleteMsgFromDatabase(args) {
  const { senderId, reciverID, msgsId } = args;

  try {

      let deletemsg = await Messages.findOneAndDelete({
          _id: {$in : msgsId.msg_id}
      });
 
    
      if (deletemsg.deletedCount === 0) {
          throw new InternalServerError("No messages were deleted");
      }

      //  Remove the deleted message IDs from the messages array in the Room collection
      let deletemsgroom = await Room.findOneAndUpdate(
          { Participant: { $all: [senderId, reciverID] } },
          { $pull: { messages: { $in: msgsId.msg_id } } }, 
          { new: true } 
      );

  
      if (!deletemsgroom) throw new InternalServerError("Room not found");

      return { msg: "Messages deleted successfully" };

  } catch (error) {
      throw new InternalServerError(error.message || "Internal server error");
  }
}


module.exports = {
  AddUserForChat,
  CheckOnlineUser,
  ChatingUser,
  Getusermsg,
  deleteMsgFromDatabase
};
