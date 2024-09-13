import React, { useMemo, useState } from 'react'
import { gql, useQuery } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { ShowChatdisplay } from '../redux/user/userSlice';
import "./index.css"
import { setCurrentUser } from '../redux/CurrentChatuser/CurrentchatuserSlice';
import { showUserDetailspage } from '../redux/user/UserDetailsPageslice';
import { showMessageDisplay } from '../redux/Messagedisplay/MessagedisplaySlice';

const UserAccount = gql`
 query getAlluser{
  users {
  _id,
   username,
   avatar{
   url
   }
   email,
   about
  }
 }
`

export default function UserList() {
  const {data,error} = useQuery(UserAccount);
  const [userdata,setUserdata] = useState()
  const {S_UID} = useSelector((state)=> state.user);
  const {searchquery} = useSelector((state)=>state.searching);
  const dispatch = useDispatch();
 

  useMemo(()=>{
    if(data){
      setUserdata(data)
     
    }
  },[data])

  if(error){
    alert(error.message);
  }
  

  function Navigatetochatuser(userId,username,useravatar,email,about){
    dispatch(showUserDetailspage(false))
    dispatch(setCurrentUser({userId,username,useravatar,email,about}))
    
    // navigate("/message");
    dispatch(showMessageDisplay(true)) 
   }



  return (
    <div className='2xl:w-[417px] 1xl:w-[417px] xl:w-[417px] 1lg:w-80 lg:w-80 1md:w-64 md:w-64 sm:w-full xs:w-full s:w-full flex flex-col'>
      {userdata && userdata.users.map((value)=>(
       <div key={value._id} 
       className={`${value.username.includes(`${searchquery}`) || value.email.includes(`${searchquery}`) ?'order-first': 'bg-transparent' }`}>

          {value._id !== S_UID._id ? 
          (  <Link onClick={()=>Navigatetochatuser(value._id,value.username,value.avatar,value.email,value.about)} 
          to={`message`} >
            <div id='listcomponent' className=' py-5 hover:bg-gray-100 transition-colors duration-200 ease-linear' >       
            <div className='flex'>
              <div className='2xl:w-20 xl:w-20 lg:w-20 md:w-20 sm:w-20 xs:w-16 s:w-16 '>
                 <div className=' 2xl:w-14 1xl:w-14 xl:w-14 1lg:w-14 lg:w-12 1md:w-12 md:w-12 sm:w-14 xs:w-12 s:w-10
                                  2xl:h-14 1xl:h-14 xl:h-14 1lg:h-14 lg:h-12 1md:h-12 md:h-12 sm:h-14 xs:h-12 s:h-10 
                 mx-auto overflow-hidden' style={{borderRadius:"50px"}}>
                  <img src={`${value.avatar.url}`} alt="" className='w-full h-full' />
                 </div>
              </div>
              <div>
                <div>
                  <h1 className=' 2xl:w-64 1xl:w-64 xl:w-56 1lg:w-48 lg:w-36 1md:w-36 md:w-28 sm:w-96 xs:w-72 s:w-44  overflow-hidden truncate '><span className=' font-bold'>{value.username}</span></h1>
                </div>
                <div>
                  <p className=' 2xl:w-64 1xl:w-64 xl:w-56 1lg:w-48 lg:w-36 1md:w-36 md:w-28  sm:w-96 xs:w-72 s:w-44 overflow-hidden truncate '>{value.email}</p>
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
