import { Link } from 'react-router-dom';
import { useSelector} from 'react-redux'
import "./index.css"
import { useSocket } from '../context/SocketProvider';
import { useMemo, useState } from 'react';



export default function UserList() {
const {S_UID} = useSelector((state)=>state.user);
const {Chat} = useSelector((state)=>state.chat);
const [newmsg ,setNewMsg] = useState();
const [newmsgVisible ,setnewMsgVisible] = useState(null);
const socket = useSocket();
const {hideNotification} = useSelector((state)=> state.chat);

useMemo(()=>{
  if(socket){
   socket.on("chatmessage",(chat)=>{
    console.log(chat);
      setTimeout(()=>{
         setNewMsg(chat)
       },1000)
   })
  }
 },[socket])
  
 function  Clearmsg(){
  setNewMsg(null);
  setnewMsgVisible(null);
 }
  return (
    <div className='w-[440px] flex flex-col'>
      {Chat && Chat.ChatUserList.List.ConnectedUser.map((value)=>(
       <div key={value._id} onClick={Clearmsg} className={newmsg && newmsg.senderId === value._id ? 'order-first' : null}>
          {value._id !== S_UID._id ? 
          (  <Link to={`message/${value._id}/${value.username}/${encodeURIComponent(value.avatar)}`} >
            <div id='listcomponent' className=' py-5 border border-b-gray-300' >       
            <div className='flex'>
              <div className='w-20 '>
                 <div className=' w-14 mx-auto overflow-hidden' style={{borderRadius:"50px"}}>
                  <img src={value.avatar} alt="" />
                 </div>
              </div>
              <div>
                <div>
                  <h1><span className=' font-bold'>{value.username}</span></h1>
                </div>
                 
                 {hideNotification === value._id ? 
                 null
                :  (newmsg && newmsg.senderId === value._id?
                  ( <div>
                    <p>{newmsg && newmsg.senderId === value._id ? newmsg.msg : null}</p>
                  </div>)
                  : null
                   )
                  }

              </div>

               {hideNotification === value._id ? 
               null
              : 
              (newmsg && newmsg.senderId === value._id ? 
                (<div className=' ml-auto' style={{width: "64px",height: "26px"}}>
                 <p className='bg-purple-600 text-white'
                   style={{
                     padding: " 0px 7px",
                     width: "25px",
                     borderRadius: "19px",
                     height: "24px",
                   }}>1</p>
             </div>):
             null)
             }
            </div>
          </div>
         </Link>)
         :
         null}
        </div>
      ))}
    </div>
  ) 
}
