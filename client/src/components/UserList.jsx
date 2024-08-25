import React, { useMemo, useState } from 'react'
import { gql, useQuery } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { ShowChatdisplay } from '../redux/user/userSlice';
import "./index.css"
import { setCurrentUser } from '../redux/CurrentChatuser/CurrentchatuserSlice';
import { showUserDetailspage } from '../redux/user/UserDetailsPageslice';

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
  const navigate = useNavigate();

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
    
    navigate("/message");
   }



  return (
    <div className='w-[417px] flex flex-col'>
      {userdata && userdata.users.map((value)=>(
       <div key={value._id} 
       className={`${value.username.includes(`${searchquery}`) || value.email.includes(`${searchquery}`) ?'order-first': 'bg-transparent' }`}>

          {value._id !== S_UID._id ? 
          (  <Link onClick={()=>Navigatetochatuser(value._id,value.username,value.avatar,value.email,value.about)} 
          to={`message`} >
            <div id='listcomponent' className=' py-5 hover:bg-gray-100 transition-colors duration-200 ease-linear' >       
            <div className='flex'>
              <div className='w-20 '>
                 <div className=' w-14 h-14 mx-auto overflow-hidden' style={{borderRadius:"50px"}}>
                  <img src={`${value.avatar.url}`} alt="" className='w-full h-full' />
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
