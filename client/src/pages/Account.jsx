import React, { lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showMsgInfo } from '../redux/chatinguserlist/MessageInfoSlice'
import { Selected_Msgs, ShowCheckBoxs_Visiblity } from '../redux/chatinguserlist/ChatList'
import { showUserDetailspage } from '../redux/user/UserDetailsPageslice'
import { chatinguserLists, showMessageDisplay } from '../redux/Messagedisplay/MessagedisplaySlice'


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
dispatch(showMessageDisplay(false));
  dispatch(chatinguserLists(true));
 
  return (
    <div className='2xl:w-full 1xl:w-full xl:w-full  1lg:w-full lg:w-full 1md:w-full md:w-full sm:w-full xs:w-full'>
  

     <div className='flex ' style={{height:"100%"}}>
     <div className='2xl:w-[417px] 1xl:w-[417px] xl:w-[417px] 1lg:w-[417px] lg:w-full 1md:w-full md:w-full sm:w-full xs:w-full' >
        <div className='2xl:w-[417px] 1xl:w-[417px] xl:w-[417px] 1lg:w-[417px] lg:w-full 1md:w-full md:w-full sm:w-full xs:w-full h-screen overflow-y-scroll overflow-x-hidden' style={{scrollbarWidth:"thin"}}> 
          <Suspense >
          <UserDetailsUpdate/>
          </Suspense>
        </div>
      </div>

 
      <div className={`2xl:w-full 1xl:w-full xl:w-full  1lg:w-full lg:w-full 1md:w-full md:w-full 
      2xl:block 1xl:block xl:block 1lg:block lg:hidden 1md:hidden md:hidden sm:hidden xs:hidden`}>
      <Suspense>
        <HeroImage />
      </Suspense>
      </div>
     
     </div>

   
     </div>
  )
}
