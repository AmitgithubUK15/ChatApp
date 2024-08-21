const Chatlist = require("../models/ChatList.model.js");
const Messages = require("../models/Messages.model.js");
const Room = require("../models/Room");
const User = require("../models/User.model.js");
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


async function DeleteUser_InChat(args){
 const {req_details} = args;

 try {

  DeleteUser_ChatList(req_details.chat_id[0][0],req_details.users_id);
  let Message_id = [];
  
  for(let i=0; i<req_details.chat_id.length; i++){
    let userroom = await Room.findOne({
      Participant: {$all : [req_details.chat_id[i][0],req_details.chat_id[i][1]]}
    })

    if(userroom){
     let concat =   Message_id.concat(userroom.messages);
     Message_id = concat;
    }
  }

   const deleteusers = await Room.deleteMany({
    Participant: {$in : req_details.chat_id}
   })

   if(!deleteusers) throw new InternalServerError("Room not found");

   const delete_msgs = await Messages.deleteMany({
     _id :{ $in : Message_id}
    })
    
    if(!delete_msgs) throw new InternalServerError("Message not deleted");
    
    

   return {msg:"deleted successfully"};
 } catch (error) {
  throw new InternalServerError(error.message || "Internal server error");
 }
}  


async function DeleteUser_ChatList(senderId, userIds) {
  try {
      // Step 1: Find the user in the Chatlist
      const findUser = await Chatlist.findOne({ user: senderId });
      if (!findUser) {
        throw new InternalServerError("Not found user in Chatlist ");
      }

      // Step 2: Get the current list of connected users
      let chatinglist = findUser.ConnectedUser;
   
      // let newList = null;
      // Step 3: Remove each userId from the connected users list
      for (let i = 0; i < userIds.length; i++) {
        chatinglist = chatinglist.filter((item) => item.toString() !== userIds[i].toString());
      }

    

      // Step 4: Update the Chatlist document with the new connected users list
      const updateUser = await Chatlist.findOneAndUpdate(
          { user: senderId },
          {
              $set: {
                  ConnectedUser: chatinglist
              }
          },
          { new: true } // Return the updated document
      );

      console.log(updateUser);
      if (!updateUser) {
        throw new InternalServerError('Failed to update user');
      }

      return 'Work completed successfully';
  } catch (error) {
    throw new InternalServerError(error.message || "Internal server error");
  }
}



module.exports = {
  AddUserForChat,
  CheckOnlineUser,
  ChatingUser,
  Getusermsg,
  deleteMsgFromDatabase,
  DeleteUser_InChat,
};
