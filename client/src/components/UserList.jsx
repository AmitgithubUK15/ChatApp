import React, { useMemo, useState } from 'react'
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { ShowChatdisplay } from '../redux/user/userSlice';
import "./index.css"

const UserAccount = gql`
 query getAlluser{
  users {
  _id,
   username,
   avatar,
   email,
  }
 }
`

export default function UserList() {
  const {data,error,loading} = useQuery(UserAccount);
  const [userdata,setUserdata] = useState()
  const {S_UID} = useSelector((state)=> state.user);
  const dispatch = useDispatch();
  useMemo(()=>{
    if(data){
      console.log(data);
      setUserdata(data)
     
    }
  },[data])

  if(error){
    alert(error.message);
  }
  
  return (
    <div className='w-[420px] mx-auto'>
      {userdata && userdata.users.map((value)=>(
       <div key={value._id} >
          {value._id !== S_UID._id ? 
          (  <Link to={`message/${value._id}`} >
            <div id='listcomponent' className=' py-5 border-b-2' >       
            <div className='flex'>
              <div className='w-20 '>
                 <div className=' w-16 mx-auto overflow-hidden' style={{borderRadius:"50px"}}>
                  <img src={value.avatar} alt="" />
                 </div>
              </div>
              <div>
                <div>
                  <h1><span className=' font-bold'>{value.username}</span></h1>
                </div>
                <div>
                  <p>{value.email}</p>
                </div>
              </div>
            </div>
          </div>
         </Link>)
         :
         null}
        </div>
      ))}
    </div>
  ) 
}
