import { Link,   } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux'
import "./index.css"
import { useSocket } from '../context/SocketProvider';
import { useEffect, useMemo,useState } from 'react';
import { Update_User_Chatlist } from '../redux/chatinguserlist/ChatList';
import { gql, useMutation } from '@apollo/client';
import { SessionExpried_Logout } from '../redux/user/userSlice';
import { checkedUser_adding } from '../redux/chatinguserlist/checkedUserslice';
import { setCurrentUser } from '../redux/CurrentChatuser/CurrentchatuserSlice';
import { showUserDetailspage } from '../redux/user/UserDetailsPageslice';
import { showMessageDisplay } from '../redux/Messagedisplay/MessagedisplaySlice';

const UserAccount = gql`
mutation getusers($sender:String!){
 ChatUserList(sender:$sender){
  List{
      ConnectedUser{
          username,
          _id,
          email,
          about,
          avatar{
          filename,
          size,
          type,
          url
          }
      }
  }
 }
}
`

export default function UserList() {
const {S_UID} = useSelector((state)=>state.user);
const {Chat} = useSelector((state)=>state.chat);

const [ChatUserList ] = useMutation(UserAccount);
const [newmsg ,setNewMsg] = useState();
const [newmsegVisibl,setnewMsgVisible] = useState(null);
const socket = useSocket();
const {hideNotification,ShowcheckBox_userlist} = useSelector((state)=> state.chat);
const dispatch = useDispatch();
const {searchquery} = useSelector((state)=>state.searching);
const [Userdata,setUserdata] = useState();


 function Navigatetochatuser(userId,username,useravatar,email,about){
  dispatch(showUserDetailspage(false))
  dispatch(setCurrentUser({userId,username,useravatar,email,about}))
    // navigate("/message");
    
    dispatch(showMessageDisplay(true)) 
    
 }

 
 


  // store in state
  useEffect(()=>{
        if(Userdata){
          dispatch(Update_User_Chatlist(Userdata.ChatUserList.List.ConnectedUser));
        }
  },[Userdata])

  
    useEffect(()=>{
      async function GetUserChatList(){
        try {
          const {data} =   await ChatUserList({variables:{sender:S_UID._id}})
          setUserdata(data);
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

    // useMemo(()=>{
    //   if(error){
    //     console.log(error.message);
    //   }
    // },[error])

  useMemo(()=>{
  if(socket){
   socket.on("chatmessage",(chat)=>{
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
    <div className='2xl:w-[417px] 1xl:w-[417px] xl:w-[417px] 1lg:w-80 lg:w-80 1md:w-64 md:w-64 sm:w-full xs:w-full flex flex-col' style={{}}>
      {Chat && Chat.map((value)=>(
       <div key={value._id} onClick={Clearmsg} 
       className={` ${newmsg && newmsg.senderId === value._id ? 'order-first' : null} 
       flex  
       ${ShowcheckBox_userlist ? "hover:bg-red-100" :"hover:bg-gray-100"} 
       transition-colors duration-200 ease-linear
       ${value.username.includes(`${searchquery}`) || value.email.includes(`${searchquery}`)   ?'order-first': 'bg-transparent' }
       ` 
       } >

        

          {value._id !== S_UID._id ? 
          (  <Link 
            onClick={()=>Navigatetochatuser(value._id,value.username,value.avatar,value.email,value.about)} 
          // to={`message`}
           className='block w-full'>
            
            <div id='listcomponent'
             className='  py-3  transition-colors duration-200 ease-linear' >       
            <div className='flex'>
              <div className='w-20 '>
                 <div className=' w-12 h-12  shadow-md mx-auto overflow-hidden' style={{borderRadius:"50px"}}>
                  <img src={`${value.avatar.url}`} alt="" className='w-full h-full' />
                 </div>
              </div>
              <div>
                <div>
                  <h1><span className=' font-bold'>{value.username}</span></h1>
                </div>
                 
                    {hideNotification === value._id ?
                      null
                      :
                      (newmsg && newmsg.senderId === value._id ?
                        (
                          <div>
                            <p>{newmsg && newmsg.senderId === value._id ? newmsg.msg : null}</p>
                          </div>
                        )
                        : null
                      )
                    }

              </div>

               {hideNotification === value._id ? 
               null
              : 
              (newmsg && newmsg.senderId === value._id ? 
                (<div className=' ml-auto' style={{width: "64px",height: "26px"}}>
                 <p className='bg-purple-600 text-white shadow-lg'
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
