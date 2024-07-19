import {  useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import { gql, useMutation } from '@apollo/client';
import { useSocket } from '../context/SocketProvider';
import SearchBox from '../components/SearchBox';

const SendMessage = gql`
mutation Msgsend($senderId:String!,$reciverID:String!,$msg:String!,$Date:String!,$Time:String!,$Day:String!){
 RequestforChat(senderId:$senderId,reciverID:$reciverID,msg:$msg,Date:$Date,Time:$Time,Day:$Day){
  ChatMsg{
  _id,
   senderId,
   msg,
   Time,
  }
 }
}
`;


export default function Chat() {

 const [RequestforChat,{data}] = useMutation(SendMessage)
 const {S_UID} = useSelector((state)=>state.user);
 const [message,setMessage] = useState()
 const [connectID,setConnectID] = useState()
 const socket = useSocket();
 const [MsgList,setMsgList] = useState([])


 useMemo(()=>{
    if(data !== undefined){
      setTimeout(()=>{
        setMsgList((prev)=>[...prev,data && data.RequestforChat.ChatMsg]);
      },1000)
    }
    else {
      return null;
    }
 },[data])

 useMemo(()=>{
   if(message){
    setMessage("");
   }
   else{
    return null;
   }
 },[MsgList])

useMemo(()=>{
 if(socket){
  socket.on("chatmessage",(chat)=>{
    setTimeout(()=>{
      setMsgList((prev)=>[...prev,chat])
    },1000)
  })
 }
},[socket])

 async function HandleSubmit(e){
    e.preventDefault();
  try {
    const day = ["Sunday","Monday","Tuesday","Webnesday","Thrusday","Friday","Saturday"]
    const Currentdate = new Date();
    const dayNumber = Currentdate.getDay();
    await RequestforChat(
      {variables:
        {
        senderId:S_UID,
        reciverID:connectID,
        msg:message,
        Date:Currentdate.toLocaleDateString(),
        Time:Currentdate.toLocaleTimeString(),
        Day:day[dayNumber]
      }
    }
  )
  } catch (error) {
    console.log(error.message)
  }
 }


  return (
    <div>
       <SearchBox />
        <h1>Chat</h1>
        
        <form onSubmit={HandleSubmit} className='m-5'>
            <h1>User to</h1>
            <input type="text" className='border border-black'
           value={connectID} onChange={(e)=>setConnectID(e.target.value)}/>

            <h1>Send Messages</h1>
            <input  type="text" className='border border-black' 
            value={message} onChange={(e)=>setMessage(e.target.value)}/>
          
            
            <button type='submit'>Send</button>
            
            <div>
                {MsgList && MsgList.map((value)=>(
                    <div key={value._id} className={S_UID === value.senderId ?`text-green-500`:`text-gray-600`}>
                      {value.senderId} = {value.msg}
                    </div>
                ))}
            </div> 
        </form>
    </div>
  )
}
