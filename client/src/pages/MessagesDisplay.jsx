import { lazy, Suspense } from 'react'
import ChatingHeader from '../components/ChatingHeader';
import ChatBox from '../components/ChatBox';
import { useSelector } from 'react-redux';
import MessageInfo from '../components/MessageInfo';
import UserDetailsPage from '../components/UserDetailsPage';

const HeroImage = lazy(()=>import("../components/HeroImage"))

export default function MessagesDisplay() {
  
   const {currentuser} = useSelector((state)=>state.currentchatuser);
   const {showMsg_Info_component} = useSelector((state)=>state.msgInfo);
   const {visible_userdetailspage} = useSelector((state)=>state.userdetailspage);
   
   
  return (
    <div className='h-full'>
    { currentuser && currentuser.userId ? (
      <div className=' w-[780px] h-full overflow-hidden  flex  flex-col'>
        {!showMsg_Info_component &&  !visible_userdetailspage &&
        <>
        <ChatingHeader />
        <ChatBox/>
        </>
        }

        {showMsg_Info_component && <MessageInfo />}

        {visible_userdetailspage && <UserDetailsPage />}
      </div>
    )
  :
  (
    <Suspense>
        <HeroImage />
      </Suspense>
     
  )
  }
  </div>
  )
}
