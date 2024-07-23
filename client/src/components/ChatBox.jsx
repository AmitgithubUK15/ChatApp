import { gql, useMutation } from '@apollo/client';
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../context/SocketProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { Hide_Msg_Notification } from '../redux/chatinguserlist/ChatList';
import { logout } from '../redux/user/userSlice';
import Picker from 'emoji-picker-react';


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

const GetMessage = gql`
mutation getmsgs($senderId:String!,$reciverID:String!){
  GetUserMessages(senderId:$senderId,reciverID:$reciverID){
  messages{
   _id,
   senderId,
   msg,
   Time,
  }
  }
}
`

export default function ChatBox() {
  const {userId} = useParams();
  const [RequestforChat] = useMutation(SendMessage);
  const [GetUserMessages] = useMutation(GetMessage)
  const {S_UID} = useSelector((state)=>state.user);
  const [inputvalue, setInputValue] = useState("");
  const socket = useSocket();
  const [MsgList,setMsgList] = useState()
  const dispatch = useDispatch();
  const [sendmsgData,setSendMsgData] = useState();
  const navigate = useNavigate();
  const [logged,setLogged] =useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [Emoji,setEmoji] = useState()

  useMemo(()=>{
    if(logged){
      alert(logged);
      dispatch(logout())
      navigate("/login")
    }
  },[logged])
  
  async function getUsermsg(){
    setMsgList("")
    try {
     const {data} =  await GetUserMessages({variables:{senderId:S_UID._id,reciverID:userId}})

     if(data !== undefined){
      setMsgList(data.GetUserMessages.messages);
     }
    } catch (error) {
      if(error){
            if(error.message === "Session Expired, please login"){
              setLogged(error.message)
             }
          }
          else{
            console.log(error.message);
          }
    }
  }

  useMemo(()=>{
    dispatch(Hide_Msg_Notification(userId))
    getUsermsg();
  },[userId])

  useMemo(()=>{
    if(sendmsgData !== undefined){
      setTimeout(()=>{
        setMsgList((prev)=>[...prev,sendmsgData && sendmsgData.RequestforChat.ChatMsg]);
      },1000)
    }
    else {
      return null;
    }
 },[sendmsgData])

 useMemo(()=>{
  if(inputvalue){
   setInputValue("");
  }
  else{
   return null;
  }
},[MsgList])

 useMemo(()=>{
  if(socket){
   socket.on("chatmessage",(chat)=>{
     if(chat.senderId === userId){
      setTimeout(()=>{
         setMsgList((prev)=>[...prev,chat])
       },1000)
     }
     else {
      return null;
     }
   })
  }
 },[socket])

  async function CreateMessage(e) {
    e.preventDefault();
    try {
      const day = ["Sunday","Monday","Tuesday","Webnesday","Thrusday","Friday","Saturday"]
      const Currentdate = new Date();
      const dayNumber = Currentdate.getDay();
    const {data} =  await RequestforChat(
        {variables:
          {
          senderId:S_UID._id,
          reciverID:userId,
          msg:inputvalue,
          Date:Currentdate.toLocaleDateString(),
          Time:Currentdate.toLocaleTimeString(),
          Day:day[dayNumber]
        }
      }
    )

    if(data){
      setSendMsgData(data)
    }

    } catch (error) {
      if(error){
        if(error.message === "Session Expired, please login"){
          setLogged(error.message)
         }
      }
      else{
        console.log(error.message);
      }
    }
  }


  useMemo(()=>{
    if(Emoji){
      setInputValue(inputvalue + Emoji);
      setEmoji("");
    }
  },[Emoji])

  function splittime(time){
    let split = time.split(' ');

    let first = split[0].split(':');
    let log = `${first[0]} : ${first[1]} ${split[1]}`;
    return log;   
  }
  return (
    <div className='h-full overflow-hidden' >
      <div className='flex flex-col h-full' >
        <div className=' h-full flex flex-col-reverse overflow-y-scroll overflow-x-hidden' id="ChatboxMainContainer" style={{scrollbarWidth:"thin", backdropFilter:"blur" }}>
          <div className='flex'>
             <div style={{width:"100%" }} className='mx-5'>
             {MsgList && MsgList.map((value)=>(
              <div key={value._id} style={{width:"100%",margin:"35px 0"}} className={value.senderId === S_UID._id ? ` flex justify-end text-right` :` flex justify-start`} >
                  <div style={{width:"50%"}}>
                  <span className={S_UID._id === value.senderId ? `bg-purple-700 inline-block shadow-xl p-2 text-lg font-semibold rounded-xl text-white`
                    :`bg-slate-500 p-2 inline-block shadow-xl text-lg font-semibold rounded-xl text-white`
                  }>{value.msg} 
                  <span className='font-normal  mx-1 text-[9px] '>{splittime(value.Time)}</span>

                  </span>
                  </div>
              </div>
            ))}
             </div>
          </div>
        </div>


      {/* inputbox */}
        <div className=' relative bottom-0'>
          <div className='w-full border bg-gray-300'>

            <div className='my-2' >
              <form onSubmit={CreateMessage}>
                <div className='flex gap-5 mx-2'>
                  <div>
                  <button className='my-2' onClick={() => setShowPicker(!showPicker)}>
                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet"  version="1.1" x="0px" y="0px" ><title>smiley</title><path fill="currentColor" d="M9.153,11.603c0.795,0,1.439-0.879,1.439-1.962S9.948,7.679,9.153,7.679 S7.714,8.558,7.714,9.641S8.358,11.603,9.153,11.603z M5.949,12.965c-0.026-0.307-0.131,5.218,6.063,5.551 c6.066-0.25,6.066-5.551,6.066-5.551C12,14.381,5.949,12.965,5.949,12.965z M17.312,14.073c0,0-0.669,1.959-5.051,1.959 c-3.505,0-5.388-1.164-5.607-1.959C6.654,14.073,12.566,15.128,17.312,14.073z M11.804,1.011c-6.195,0-10.826,5.022-10.826,11.217 s4.826,10.761,11.021,10.761S23.02,18.423,23.02,12.228C23.021,6.033,17.999,1.011,11.804,1.011z M12,21.354 c-5.273,0-9.381-3.886-9.381-9.159s3.942-9.548,9.215-9.548s9.548,4.275,9.548,9.548C21.381,17.467,17.273,21.354,12,21.354z  M15.108,11.603c0.795,0,1.439-0.879,1.439-1.962s-0.644-1.962-1.439-1.962s-1.439,0.879-1.439,1.962S14.313,11.603,15.108,11.603z"></path></svg>
                    </button>
                   
                  </div>
                  <div className='border-red-400 w-full'>
                    <input type="text" className=' text-lg py-2 px-4 w-full rounded-xl outline-none border-none' placeholder='Type a message'
                      value={inputvalue} onChange={(e) => setInputValue(e.target.value)} />
                  </div>
                  <div className='w-14 border rounded-full' style={{ backgroundColor: "rgb(168 0 194)" }}>
                    <button type="submit" className='block mx-auto py-2'>
                      <div>
                        <img src={inputvalue ? "/images/right-arrow.png" : "/images/sound.png"} className='h-6 w-5' alt="" />
                      </div>
                    </button>
                  </div>
                </div>
               
              </form>
              {showPicker && (
               <div style={{width:"100%", position: 'relative', top: '2px', left: '10px' }}>
                <Picker height="450px" width="100%" value={Emoji} onEmojiClick={(e)=>setEmoji(e.emoji)} />
              </div>
                   )}
  
            </div>
          </div>

        </div>
       
      </div>
    </div>
  )
}
