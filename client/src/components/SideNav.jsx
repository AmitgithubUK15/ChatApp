

import {  useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import "./index.css"
import { logout } from '../redux/user/userSlice';
import { useSocket } from '../context/SocketProvider';
import { setCurrentUser } from '../redux/CurrentChatuser/CurrentchatuserSlice';
import { chatinguserLists, showMessageDisplay } from '../redux/Messagedisplay/MessagedisplaySlice';
import { gql, useMutation } from '@apollo/client';

const LogoutFn = gql`
 mutation Logoutfn {
   Logout{
   msg
   }
 }
`


export default function SideNav() {
    const [Logout] = useMutation(LogoutFn);
    const {S_UID} = useSelector((state)=>state.user);
    const {currentuser} = useSelector((state)=>state.userdetails);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = useSocket();
    
    async function  HandleLogout(){
     try {
        const {data} = await Logout();
        if(data.Logout.msg === "Logout successfully"){
            socket.emit("client-disconnect", {userId: S_UID._id})
            socket.disconnect();
            dispatch(logout());
            localStorage.clear();
            dispatch(setCurrentUser(null));
            navigate("/login");
        }
     } catch (error) {
        console.log(error.message);
     }
    }

   function ResetCurrentChatingUser(){
    dispatch(setCurrentUser(null));
    dispatch(showMessageDisplay(false))
    dispatch(chatinguserLists(true));

   }
  return (
    <div className=' 2xl:w-16 xl:w-16 lg:w-16 md:w-16 sm:w-16 xs:w-14 s:w-12 h-full   ' >
        <div className='flex flex-col  gap-6 2xl:m-2 xl:m-2 lg:m-2 md:m-2 sm:m-2 xs:m-1 s:m-1'>
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
