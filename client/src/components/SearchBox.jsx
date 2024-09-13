import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SelectUser, ShowChatingList_dropdown, Update_User_Chatlist } from '../redux/chatinguserlist/ChatList';
import { gql, useMutation } from '@apollo/client';
import { search } from '../redux/SearchUser/searchuserSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

const DeleteChat_gql = gql`
mutation deletechat ($req_details:Deletechatuser){
 DeleteChatingUsers(req_details:$req_details){
 msg
 }
}
`

export default function SearchBox() {
  const {Chating_user_setting_dropdown,ShowcheckBox_userlist} = useSelector((state)=>state.chat);
  const dispatch = useDispatch();
  const [DeleteChatingUsers] = useMutation(DeleteChat_gql)
  
  const {S_UID} = useSelector((state)=> state.user);
  const {checkUser,checkedUserId} = useSelector((state)=> state.checkeduser);
  const {Chat} = useSelector((state)=>state.chat);

  function ShowDropDown(){
    if(Chating_user_setting_dropdown){
      dispatch(ShowChatingList_dropdown(false))
    }
    else{
      dispatch(ShowChatingList_dropdown(true))
    }
  }

  function HandleSelect(){
    if(ShowcheckBox_userlist){
      dispatch(SelectUser(false))
    }
    else{
      dispatch(SelectUser(true))
    }
  }

  async function Delete_Chat_Users(){

   if(checkedUserId.length ===0){
    alert("Please Select 1 user to delete")
    dispatch(ShowChatingList_dropdown(false)) 
   }
   else{
    try {
    
      if(checkUser.length > 0 && checkedUserId.length >0){
    
      let ChatList_forFilter = Chat;
      
      for(let i =0; i<checkedUserId.length; i++){
        ChatList_forFilter =  ChatList_forFilter.filter((item)=> item._id !== checkedUserId[i])
      }
     
      dispatch(Update_User_Chatlist(ChatList_forFilter));
      dispatch(ShowChatingList_dropdown(false))
       const {data} =await DeleteChatingUsers({variables:{req_details:{chat_id:checkUser,users_id:checkedUserId}}})
    
        if(data){
          alert(data.DeleteChatingUsers.msg)
       }
      }
      
     } catch (error) {
      console.log(error.message)
     }
   }
  }


  return (
    <div className='2xl:w-[417px] 1xl:w-[417px] xl:w-[417px] 1lg:w-80 lg:w-80 1md:w-64 md:w-64 sm:w-full xs:w-full s:w-full bg-white  '  >
       
       <div className='flex justify-around'>
         <form action="" className='py-3'>
          <div className='2xl:w-80 1xl:w-80 xl:w-80 1lg:w-64 lg:w-64 1md:w-48 md:w-48 sm:w-[450px] xs:w-72 s:w-48
           mx-auto  flex rounded-lg  ' style={{backgroundColor:"rgb(168 0 194)"}}>

            <input type="text"  onChange={(e)=>dispatch(search(e.target.value))}
            className='p-2 w-full outline-none border-b-2 border-purple-500' placeholder='Search by Name, Email'/>
          </div>
         </form>
         <div className='text-center cursor-pointer 2xl:w-20 sm:w-14 xs:w-10 2xl:px-0 sm:px-4 xs:px-2 s:px-1' onClick={ShowDropDown}>
          <span className='block text-2xl font-bold my-3 ' >
          <FontAwesomeIcon icon={faEllipsisVertical} />
          </span>
         </div>
       </div>
       {Chating_user_setting_dropdown && 
         <div className='2xl:w-[26rem] 2.5xl:w-[26rem] 3xl:w-[26rem] 1xl:w-[26rem] 1.5xl:w-[26rem] xl:w-[26rem] 2lg:w-[20rem] 1lg:w-[20rem] sm_lg:w-[20rem] lg:w-[20rem] 1md:w-[16rem] 2md:w-[19rem] md:w-[15rem]  sm:w-full xs:w-full s:w-full
          px-2 absolute top-20  flex flex-row-reverse z-10'>

         <div className='w-44 p-2 rounded bg-gray-100 text-left '>
         <div 
         className=' py-3 text-md px-2 rounded hover:bg-gray-200  cursor-pointer transition-colors  duration-200 ease-linear'
         onClick={HandleSelect}
         > Select
          </div>
         <div onClick={Delete_Chat_Users}
          className=' py-3 text-md px-2 rounded hover:bg-gray-200  cursor-pointer transition-colors  duration-200 ease-linear'
         >
          Delete User
         </div>
         </div>
        </div>}
    </div>
  )
}
