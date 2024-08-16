import { Link, useNavigate,  } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux'
import "./index.css"
import { useSocket } from '../context/SocketProvider';
import { useEffect, useMemo, useState } from 'react';
import { Update_User_Chatlist } from '../redux/chatinguserlist/ChatList';
import { gql, useMutation } from '@apollo/client';
import { logout, SessionExpried_Logout } from '../redux/user/userSlice';
import { checkedUser_adding } from '../redux/chatinguserlist/checkedUserslice';

const UserAccount = gql`
mutation getusers($sender:String!){
 ChatUserList(sender:$sender){
  List{
      ConnectedUser{
          username,
          _id,
          email,
          avatar
      }
  }
 }
}
`

export default function UserList() {
const {S_UID,LogoutUser} = useSelector((state)=>state.user);
const {Chat} = useSelector((state)=>state.chat);
const {checkUser,checkedUserId} = useSelector((state)=> state.checkeduser)
const [ChatUserList ,{data,error}] = useMutation(UserAccount);
const [newmsg ,setNewMsg] = useState();
const [newmsgVisible,setnewMsgVisible] = useState(null);
const socket = useSocket();
const {hideNotification,ShowcheckBox_userlist} = useSelector((state)=> state.chat);
const dispatch = useDispatch();
const navigate = useNavigate();
const [CheckedUser ,setCheckedUser] = useState([]);


 
  // Session Expired msg and logout user

  useMemo(()=>{
    if(LogoutUser){
      alert(LogoutUser);
      dispatch(logout())
      navigate("/login")
    }
  },[LogoutUser])


  // store in state
  useEffect(()=>{
        if(data){
          dispatch(Update_User_Chatlist(data.ChatUserList.List.ConnectedUser));
        }
  },[data])

  
    useEffect(()=>{
      async function GetUserChatList(){
        try {
            await ChatUserList({variables:{sender:S_UID._id}})
            
          } catch (error) {
            if(error){
              if(error.message === "Session Expired, please login"){
                dispatch(SessionExpried_Logout(error.message))
               }
            }
            else{
              console.log(error.message);
            }
          }
    }

    GetUserChatList();
    },[])

    useMemo(()=>{
      if(error){
        console.log(error.message);
      }
    },[error])

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

//  clear previous checked users
useEffect(()=>{
  if(ShowcheckBox_userlist){
    dispatch(checkedUser_adding([]))
  }
  else{
    dispatch(checkedUser_adding([]))
  }
},[ShowcheckBox_userlist])




  return ( 
    <div className='w-[440px] flex flex-col' style={{}}>
      {Chat && Chat.map((value)=>(
       <div key={value._id} onClick={Clearmsg} 
       className={` ${newmsg && newmsg.senderId === value._id ? 'order-first' : null} flex  ${ShowcheckBox_userlist ? "hover:bg-red-100" :"hover:bg-gray-100"} transition-colors duration-200 ease-linear` } >

        

          {value._id !== S_UID._id ? 
          (  <Link to={`message/${value._id}/${value.username}/${encodeURIComponent(value.avatar)}`} className='block w-[90%]' >
            
            <div id='listcomponent' className='  py-5  transition-colors duration-200 ease-linear' >       
            <div className='flex'>
              <div className='w-20 '>
                 <div className=' w-14 mx-auto overflow-hidden' style={{borderRadius:"50px"}}>
                  <img src={`${value.avatar}`} alt="" />
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

        {ShowcheckBox_userlist &&  
        <div className='text-right  h-[96px] px-3 py-4'  >
           <input type="checkbox" value={[S_UID._id,value._id]} onChange={(e)=> dispatch(checkedUser_adding(e.target.value))}/>
          </div> }
        </div>
      ))}
    </div>
  ) 
}
