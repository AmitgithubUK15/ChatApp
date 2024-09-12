

import {  useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import "./index.css"
import { logout } from '../redux/user/userSlice';
import { useSocket } from '../context/SocketProvider';
import { setCurrentUser } from '../redux/CurrentChatuser/CurrentchatuserSlice';
import { chatinguserLists, showMessageDisplay } from '../redux/Messagedisplay/MessagedisplaySlice';




export default function SideNav() {
    
    const {S_UID} = useSelector((state)=>state.user);
    const {currentuser} = useSelector((state)=>state.userdetails);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = useSocket();
    
    function  HandleLogout(){
      socket.emit("client-disconnect", {userId: S_UID._id})
      socket.disconnect();
      dispatch(logout());
      localStorage.clear();
      dispatch(setCurrentUser(null));
      navigate("/login");
    }

   function ResetCurrentChatingUser(){
    dispatch(setCurrentUser(null));
    dispatch(showMessageDisplay(false))
    dispatch(chatinguserLists(true));

   }
  return (
    <div className=' w-16 h-full   ' >
        <div className='flex flex-col m-2 gap-6'>
            <Link to="/account">
            <div title='Profile'>
                <div className='mx-auto  w-10 h-10 rounded-3xl  shadow-md overflow-hidden'>
                   <img src={`${currentuser && currentuser.avatar.url}`} alt="" className='w-full h-full bg-gray-300' />
                </div>
            </div>
            </Link>
          
           <Link  to="/rooms">
           <div title='Messages'>
                <div className='mx-auto  w-10 h-8 overflow-hidden'>
                   <img src="/images/message.png" alt=""   className='mx-auto  w-8 h-8' />
                </div>
            </div>
           </Link>
          
            <Link onClick={ResetCurrentChatingUser} to="/Adduser">
            <div title='Adduser'>
                <div className='mx-auto  w-12 h-10  overflow-hidden'>
                   <img src="/images/addchat.png" alt=""  className='mx-auto w-9 h-9' />
                </div>
            </div>
            </Link>
            
            
            <div  title='Logout' onClick={HandleLogout} className=' cursor-pointer'>
                <div className='mx-auto  w-12 h-8  overflow-hidden'>
                   <img src="/images/logout.png" alt="" width={40}  className='mx-auto  w-8 h-8 ' />
                </div>
            </div>
         
           

        </div>
    </div>
  )
}
