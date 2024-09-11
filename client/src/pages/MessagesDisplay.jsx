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
   const {visibledisplay} = useSelector((state)=>state.msgdisplay)
   
  //  2xl:block xl:block lg:block md:block ${visibledisplay ? "sm:block":"sm:hidden"} ${visibledisplay ? "xs:block":"xs:hidden"} 
  return (
    <div className={`h-full 2xl:w-full 1xl:w-full xl:w-full  1lg:w-full lg:w-full 1md:w-full md:w-full sm:w-full xs:w-full 
    2xl:block xl:block lg:block md:block ${visibledisplay ? "sm:block xs:block":"sm:hidden xs:hidden"}
    `}  >
    { currentuser && currentuser.userId ? (
      <div className=' 2xl:w-full xl:w-full h-full overflow-hidden  flex  flex-col'>
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
