

import {  useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import "./index.css"
import { logout } from '../redux/user/userSlice';
import { useSocket } from '../context/SocketProvider';




export default function SideNav() {
    
    const {S_UID} = useSelector((state)=>state.user);
    const {currentuser} = useSelector((state)=>state.userdetails);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = useSocket();
    
    function  HandleLogout(){
      socket.emit("client-disconnect", {userId: S_UID._id})
      socket.disconnect();
      dispatch(logout())
      localStorage.clear();
      navigate("/login");
    }


  return (
    <div className=' w-20 h-full  bg-white ' >
        <div className='flex flex-col m-2 gap-6'>
            <Link to="/account">
            <div title='Profile'>
                <div className='mx-auto  w-12 h-12 rounded-3xl  shadow-md overflow-hidden'>
                   <img src={`${currentuser && currentuser.avatar.url}`} alt=""  />
                </div>
            </div>
            </Link>
          
           <Link to="/rooms">
           <div title='Messages'>
                <div className='mx-auto  w-14 h-14 rounded-3xl   overflow-hidden'>
                   <img src="/images/message.png" alt=""  width={40}  className='mx-auto my-2' />
                </div>
            </div>
           </Link>
          
            <Link to="/Adduser">
            <div title='Adduser'>
                <div className='mx-auto  w-12 h-12 rounded-3xl    overflow-hidden'>
                   <img src="/images/addchat.png" alt=""  />
                </div>
            </div>
            </Link>
            
            
            <div title='Logout' onClick={HandleLogout} className=' cursor-pointer'>
                <div className='mx-auto  w-12 h-12 rounded-3xl   overflow-hidden'>
                   <img src="/images/logout.png" alt="" width={40}  className='mx-auto my-2' />
                </div>
            </div>
         
           

        </div>
    </div>
  )
}
