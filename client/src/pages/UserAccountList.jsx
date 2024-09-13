
// import UserList from '../components/UserList'
// import SearchBox from '../components/SearchBox'
import React, {  Suspense, useEffect, useMemo} from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import MessagesDisplay from './MessagesDisplay'
import { useDispatch, useSelector } from 'react-redux'
import { Selected_Msgs, ShowChatingList_dropdown, ShowCheckBoxs_Visiblity } from '../redux/chatinguserlist/ChatList'
import { showMsgInfo } from '../redux/chatinguserlist/MessageInfoSlice'
import { showUserDetailspage } from '../redux/user/UserDetailsPageslice'
import { useSocket } from '../context/SocketProvider'
import { logout } from '../redux/user/userSlice'
import { setCurrentUser } from '../redux/CurrentChatuser/CurrentchatuserSlice'

const SearchBox = React.lazy(()=>import("../components/SearchBox"))
const UserList = React.lazy(()=>import("../components/UserList"))

export default function UserAccountList() {
  const dispatch = useDispatch();
  const {visiblechatlist} = useSelector((state)=>state.msgdisplay);
  const {S_UID,LogoutUser} = useSelector((state)=>state.user);
  const navigate = useNavigate();
   const socket = useSocket();

  let clearSelectmsg = {
    Messages_id: [],
    filemsgs_details: []
}
dispatch(showUserDetailspage(false))
dispatch(showMsgInfo(false))
dispatch(ShowCheckBoxs_Visiblity(false))
dispatch(Selected_Msgs(clearSelectmsg))


useEffect(()=>{
dispatch(ShowChatingList_dropdown(false))
},[])



  useMemo(()=>{
    if(LogoutUser !== null ){
      alert("Session Expired, please login");
      socket.emit("client-disconnect", {userId: S_UID._id})
      socket.disconnect();
      dispatch(logout());
      localStorage.clear();
      dispatch(setCurrentUser(null));
      navigate("/login")
    }
  },[LogoutUser])


  return (
    <div className='2xl:w-full 1xl:w-full xl:w-full  1lg:w-full lg:w-full 1md:w-full md:w-full sm:w-full xs:w-full' >
      
      <div className={`2xl:absolute xl:absolute lg:absolute md:absolute sm:relative
        2xl:block xl:block lg:block md:block ${visiblechatlist ? "sm:block xs:block":"sm:hidden xs:hidden"} `}>
       <Suspense>
       <SearchBox />
       </Suspense>
      </div>


       <div className='flex ' style={{height:"100%"}}>
       <div className={` 2xl:mt-16  xl:mt-16 lg:mt-16 md:mt-16 sm:mt-0
        2xl:w-[417px] 1xl:w-[417px] xl:w-[417px] 1lg:w-80 lg:w-80 1md:w-70 md:w-64 sm:w-full xs:w-full 
        2xl:block xl:block lg:block md:block ${visiblechatlist ? "sm:block xs:block":"sm:hidden xs:hidden"}`}>
          <div className={`2xl:w-[417px] 1xl:w-[417px] xl:w-[417px] 1lg:w-80 lg:w-80 1md:w-70 md:w-64 sm:w-full xs:w-full h-full  overflow-y-scroll overflow-x-hidden
         `} style={{scrollbarWidth:"thin"}}> 
            <Suspense >
            <UserList/>
            </Suspense>
          </div>
        </div>

   
      <Routes>
        <Route index element={
          <Suspense fallback={<div>Loading...</div>}>
            <MessagesDisplay />
          </Suspense>
        }  />
        <Route path={`message`} element={
          <Suspense fallback={<div>Loading...</div>}>
            <MessagesDisplay />
          </Suspense>
        } />
      </Routes> 
       </div>

     
       </div>
  
  )
}
