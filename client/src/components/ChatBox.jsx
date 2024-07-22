import { gql, useMutation } from '@apollo/client';
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../context/SocketProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { Hide_Msg_Notification } from '../redux/chatinguserlist/ChatList';
import { logout } from '../redux/user/userSlice';

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
  const [inputvalue, setInputValue] = useState();
  const socket = useSocket();
  const [MsgList,setMsgList] = useState()
  const dispatch = useDispatch();
  const [sendmsgData,setSendMsgData] = useState();
  const navigate = useNavigate();
  const [logged,setLogged] =useState(null);

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

  function splittime(time){
    let split = time.split(' ');

    let first = split[0].split(':');
    let log = `${first[0]} : ${first[1]} ${split[1]}`;
    return log;   
  }
  return (
    <div className='h-full overflow-hidden' >
      <div className='flex flex-col h-full'>
        <div className=' h-full bg-zinc-200 flex flex-col-reverse overflow-y-scroll overflow-x-hidden' style={{scrollbarWidth:"thin"}}>
          <div className='flex'>
             <div style={{width:"100%" }} className='mx-5'>
             {MsgList && MsgList.map((value)=>(
              <div key={value._id} style={{width:"100%",margin:"35px 0"}} className={value.senderId === S_UID._id ? ` flex justify-end text-right` :` flex justify-start`} >
                  <div style={{width:"50%"}}>
                  <span className={S_UID._id === value.senderId ? `bg-purple-700 inline-block shadow-xl p-2 text-md font-semibold rounded-xl text-white`
                    :`bg-slate-500 p-2 inline-block shadow-xl text-md font-semibold rounded-xl text-white`
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
                  <div className='border-red-400 w-full'>
                    <input type="text" className='py-2 px-4 w-full rounded-xl outline-none border-none' placeholder='Type a message'
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
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
