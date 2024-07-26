import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

const CheckUserOnlineOrNot = gql`
mutation check($user_id:String!){
 CheckUserOnline(user_id:$user_id){
  msg
 }
}
`
export default function ChatingHeader() {
  const {userId,username,profileImage}  = useParams();
  const [CheckUserOnline,{error,data}] = useMutation(CheckUserOnlineOrNot);
  const [status,setStatus] = useState(null);

  async function UserStatus(){
     try {
       await CheckUserOnline({variables:{user_id:userId}})
     } catch (error) {
       console.log(error.message)
     }
  }
  useEffect(()=>{
     UserStatus();
  },[userId])

 useMemo(()=>{
  setTimeout(()=>{
    if(data){
      setStatus(data.CheckUserOnline.msg)
    }
    else{
      return null;
    }
  },1000)
 },[data])


  return (
    <div className='w-[950px]  border-l-gray-400 ' style={{backgroundColor:"rgb(168 0 194)"}}>
       

    <div className='flex py-2 gap-3'>
      <div>
      <div className='mx-auto  w-10 h-10 rounded-3xl  shadow-md overflow-hidden'>
                   <img src={`${profileImage && profileImage}`} alt=""  />
                </div>
      </div>
      <div>
        <h1 className=''>
          <span className=' text-white font-bold text-xl'>{username}</span>
        </h1>
        <p className='text-sm font-semibold font-sans'>{status === "true" ? "Online" :"Offline"}</p>
      </div>
    </div>
 </div>
  )
}
