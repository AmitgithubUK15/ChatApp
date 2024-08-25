
// import UserList from '../components/UserList'
// import SearchBox from '../components/SearchBox'
import React, {  Suspense, useEffect} from 'react'
import { Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import MessagesDisplay from './MessagesDisplay'
import { useDispatch } from 'react-redux'
import { Selected_Msgs, ShowChatingList_dropdown, ShowCheckBoxs_Visiblity } from '../redux/chatinguserlist/ChatList'
import { showMsgInfo } from '../redux/chatinguserlist/MessageInfoSlice'
import { showUserDetailspage } from '../redux/user/UserDetailsPageslice'

const SearchBox = React.lazy(()=>import("../components/SearchBox"))
const UserList = React.lazy(()=>import("../components/UserList"))

export default function UserAccountList() {
  const dispatch = useDispatch();


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
  return (
    <div >
      
      <div className='absolute' >
       <Suspense>
       <SearchBox />
       </Suspense>
      </div>


       <div className='flex ' style={{height:"100%"}}>
       <div className=' mt-14'>
          <div className='w-[417px] h-full  overflow-y-scroll overflow-x-hidden' style={{scrollbarWidth:"thin"}}> 
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
