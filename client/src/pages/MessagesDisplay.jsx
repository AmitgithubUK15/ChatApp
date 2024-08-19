import React, { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom';
import ChatingHeader from '../components/ChatingHeader';
import ChatBox from '../components/ChatBox';

const HeroImage = lazy(()=>import("../components/HeroImage"))

export default function MessagesDisplay() {
   const {userId} = useParams();
  return (
    <div className='h-full'>
    {userId ? (
      <div className=' w-[780px] h-full overflow-hidden  flex  flex-col'>
        <ChatingHeader />
        <ChatBox/>
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
