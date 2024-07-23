import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Update_User_Chatlist } from '../redux/chatinguserlist/ChatList';

const UserAccount = gql`
mutation getusers($sender:String!){
 ChatUserList(sender:$sender){
  List{
      ConnectedUser{
          username,
          _id,
          email,
          avatar
      }
  }
 }
}
`

export default function SideNav() {
    const [ChatUserList ,{data,error}] = useMutation(UserAccount);
    const {S_UID} = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        if(data){
          dispatch(Update_User_Chatlist(data));
          
        }
      },[data])

    async function GetUserChatList(){
        try {
            await ChatUserList({variables:{sender:S_UID._id}})
            
          } catch (error) {
            console.log(error.message);
          }
          navigate("/rooms")
    }

    useMemo(()=>{
      console.log(error)
    },[error])



  return (
    <div className=' w-20 h-full  'style={{backgroundColor:"rgb(168 0 194)"}} >
        <div className='flex flex-col m-2 gap-6'>
            <Link to="/account">
            <div>
                <div className='mx-auto  w-12 h-12 rounded-3xl  shadow-md overflow-hidden'>
                   <img src={S_UID && S_UID.avatar} alt=""  />
                </div>
            </div>
            </Link>
          
           {/* <Link to="/rooms"> */}
           <div onClick={GetUserChatList} className=' cursor-pointer'>
                <div className='mx-auto  w-14 h-14 rounded-3xl   overflow-hidden'>
                   <img src="/images/message.png" alt=""  width={40}  className='mx-auto my-2' />
                </div>
            </div>
           {/* </Link> */}
          
            <Link to="/Adduser">
            <div>
                <div className='mx-auto  w-12 h-12 rounded-3xl    overflow-hidden'>
                   <img src="/images/addchat.png" alt=""  />
                </div>
            </div>
            </Link>
            
            <Link to="/settings">
            <div >
                <div className='mx-auto  w-12 h-12 rounded-3xl   overflow-hidden'>
                   <img src="/images/setting.png" alt="" width={40}  className='mx-auto my-2' />
                </div>
            </div>
            </Link>
           

        </div>
    </div>
  )
}
