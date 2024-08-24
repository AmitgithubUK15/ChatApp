import { lazy, Suspense } from 'react'
import ChatingHeader from '../components/ChatingHeader';
import ChatBox from '../components/ChatBox';
import { useSelector } from 'react-redux';
import MessageInfo from '../components/MessageInfo';

const HeroImage = lazy(()=>import("../components/HeroImage"))

export default function MessagesDisplay() {
  
   const {currentuser} = useSelector((state)=>state.currentchatuser);
   const {showMsg_Info_component} = useSelector((state)=>state.msgInfo);
  return (
    <div className='h-full'>
    { currentuser && currentuser.userId ? (
      <div className=' w-[780px] h-full overflow-hidden  flex  flex-col'>
        {!showMsg_Info_component && 
        <>
        <ChatingHeader />
        <ChatBox/>
        </>
        }

        {showMsg_Info_component && <MessageInfo />}
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
