import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ChatingUser from '../components/ChatingUser';

export default function MessagesDisplay() {
   const {userId} = useParams();
  return (
    <div className='h-full'>
    {userId ? (
      <div className=' w-[950px]  overflow-hidden  flex  '>
        <ChatingUser />
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
