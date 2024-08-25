import React, {  Suspense, useCallback, useEffect} from 'react'
import { Route, Routes,  } from 'react-router-dom'
import MessagesDisplay from './MessagesDisplay'
import { useDispatch } from 'react-redux'
import { Selected_Msgs, SelectUser, ShowChatingList_dropdown, ShowCheckBoxs_Visiblity } from '../redux/chatinguserlist/ChatList'
import SearchBox from '../components/SearchBox'
import { showMsgInfo } from '../redux/chatinguserlist/MessageInfoSlice'
import { showUserDetailspage } from '../redux/user/UserDetailsPageslice'


// const SearchBox = React.lazy(()=>import("../components/SearchBox"))
const ChatingUserList = React.lazy(()=>import("../components/ChatingUserList"))

export default function Chat() {
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
dispatch(SelectUser(false))
},[])

  return (
    <div>
      
      <div className='absolute'>
       {/* <Suspense> */}
       <SearchBox />
       {/* </Suspense> */}
      </div>


       <div className='flex ' style={{height:"100%"}}>
       <div className='mt-16'>
          <div className='w-[417px] h-full  overflow-y-scroll overflow-x-hidden' style={{scrollbarWidth:"thin"}}> 
            <Suspense >
            <ChatingUserList/>
            </Suspense>
          </div>
        </div>

   
      <Routes>
        <Route index element={
          <Suspense fallback={<div>Loading...</div>}>
            <MessagesDisplay />
          </Suspense>
        }  />
        <Route path="/message" element={
          <Suspense fallback={<div>Loading...</div>}>
            <MessagesDisplay />
          </Suspense>
        } />
      </Routes> 
       </div>

     
       </div>
  )
}
