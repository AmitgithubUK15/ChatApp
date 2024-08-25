import React, { lazy, Suspense } from 'react'
import { useDispatch } from 'react-redux'
import { showMsgInfo } from '../redux/chatinguserlist/MessageInfoSlice'
import { Selected_Msgs, ShowCheckBoxs_Visiblity } from '../redux/chatinguserlist/ChatList'
import { showUserDetailspage } from '../redux/user/UserDetailsPageslice'

const SearchBox = lazy(()=>import("../components/SearchBox"))
const UserDetailsUpdate = lazy(()=>import("../components/UserDetailsUpdate"))
const HeroImage = lazy(()=>import("../components/HeroImage"))

export default function Account() {

  const dispatch = useDispatch();

  let clearSelectmsg = {
    Messages_id: [],
    filemsgs_details: []
}
dispatch(showMsgInfo(false))
dispatch(ShowCheckBoxs_Visiblity(false))
dispatch(Selected_Msgs(clearSelectmsg))
dispatch(showUserDetailspage(false))
  return (
    <div>
      
    <div className='absolute'>
     <Suspense>
     <SearchBox />
     </Suspense>
    </div>


     <div className='flex ' style={{height:"100%"}}>
     <div className='mt-16'>
        <div className='w-[417px] h-screen overflow-y-scroll overflow-x-hidden' style={{scrollbarWidth:"thin"}}> 
          <Suspense >
          <UserDetailsUpdate/>
          </Suspense>
        </div>
      </div>

 
      <Suspense>
        <HeroImage />
      </Suspense>
     
     </div>

   
     </div>
  )
}
