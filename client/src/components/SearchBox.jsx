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
    <div className='w-[417px] bg-white  '  >
       
       <div className='flex justify-around'>
         <form action="" className='py-3'>
          <div className=' w-80 mx-auto  flex rounded-lg  ' style={{backgroundColor:"rgb(168 0 194)"}}>

            <input type="text"  onChange={(e)=>dispatch(search(e.target.value))}
            className='p-2 w-full outline-none border-b-2 border-purple-500' placeholder='Search by Name, Email'/>
          </div>
         </form>
         <div className='text-center cursor-pointer w-20' onClick={ShowDropDown}>
          <span className='block text-2xl font-bold my-3 ' >
          <FontAwesomeIcon icon={faEllipsisVertical} />
          </span>
         </div>
       </div>
       {Chating_user_setting_dropdown && 
         <div className='w-[25rem] px-2 absolute top-16  flex flex-row-reverse z-10'>

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
