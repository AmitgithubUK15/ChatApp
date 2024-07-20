import React from 'react'
import { useParams } from 'react-router-dom';
import ChatingHeader from '../components/ChatingHeader';
import ChatBox from '../components/ChatBox';

export default function MessagesDisplay() {
   const {userId} = useParams();
  return (
    <div className='h-full'>
    {userId ? (
      <div className=' w-[950px] h-full overflow-hidden  flex  flex-col'>
        <ChatingHeader />
        <ChatBox/>
      </div>
    )
  :
  (
    <div className=' w-[950px] h-full border overflow-hidden  flex justify-center items-center'>
      <div className='w-[500px] h-[500px] ' >
    <img src="/images/Messaging-pana.svg" alt="" srcSet='/images/Messaging-pana.svg'/>
  </div>
    </div>
  )
  }
  </div>
  )
}
