import { gql, useMutation } from '@apollo/client';
import  { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import {  remove_ui_msg, ShowCheckBoxs_Visiblity, ShowMsgSettingDropDownBox } from '../redux/chatinguserlist/ChatList';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import app from '../firebase';

const CheckUserOnlineOrNot = gql`
mutation check($user_id:String!){
 CheckUserOnline(user_id:$user_id){
  msg
 }
}
`

const Deletemessages_Mutation = gql`
 mutation msgdelete($senderId:String!,$reciverID:String!,$msgsId:DeleteMsgs){
  DeleteUserMsg(senderId:$senderId,reciverID:$reciverID,msgsId:$msgsId){
   msg
  }
 }
`

export default function ChatingHeader() {
  const {S_UID} = useSelector((state)=>state.user);
  const {selectedmsg} = useSelector((state)=> state.chat);
  const {userId,username,profileImage}  = useParams();
  const [CheckUserOnline,{data}] = useMutation(CheckUserOnlineOrNot);
  const [DeleteUserMsg] = useMutation(Deletemessages_Mutation);
  const [status,setStatus] = useState(null);
  const {MsgSettingDropDown,Selection_Check_Visible} = useSelector((state)=>state.chat);
  const dispatch = useDispatch();
  const [deletefile_firebase,setDeletefile_firebase] = useState(false);

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


//  Show MsgSettingbox

function ShowMsgsettingsBox(){
  if(!MsgSettingDropDown){
    dispatch(ShowMsgSettingDropDownBox(true))
  }
  else{
    dispatch(ShowMsgSettingDropDownBox(false))
  }
}




// show checkbox on message

function show_Checkbox_onMessages(){
  if(!Selection_Check_Visible){
    dispatch(ShowCheckBoxs_Visiblity(true))
  }
  else{
    dispatch(ShowCheckBoxs_Visiblity(false))
  }
}


// send to msg on server for delete msg
async function Send_DeleteMsg_Details(){
 try {
  
  dispatch(remove_ui_msg())
  let deletemsgobject = {
    msg_id:selectedmsg.Messages_id,
  }
  
  let {data} = await DeleteUserMsg({variables:{senderId:S_UID._id,reciverID:userId,msgsId:deletemsgobject}})
  
  if(data){
    setDeletefile_firebase(!deletefile_firebase ? true : false)
  }

  
 } catch (error) {
  console.log(error.message)
 }
}


// file deleting code in fire base 

useMemo(()=>{
  let fileArray =selectedmsg&&  selectedmsg.filemsgs_details.filter((item)=>item!==null);
  if(selectedmsg === null || selectedmsg === undefined || fileArray.length < 0){
   return null;
  }
  else{
     if (fileArray.length>0) {
      console.log(selectedmsg.filemsgs_details)
      // Reference to the file in Firebase Storage
      const storage = getStorage(app);
      const fileRef = [];

       for (let i =0; i<selectedmsg.filemsgs_details.length; i++){
        const file = ref(storage,selectedmsg.filemsgs_details[i].filename);
        console.log('work on fileref')
        fileRef.push(file);
      }

      console.log("fileref",fileRef)
      let promises = [];

      for(let i=0; i<fileRef.length; i++){
        // const deletefile = // Delete the file
        // deleteObject(fileRef[i])
        //  .then(() => {
        //    console.log("File delete successfully")
        //    // setMessage('File deleted successfully');
        //  })
        //  .catch((error) => {
        //    console.log("hee")
        //    console.error('Error deleting file:', error);
        //    // setMessage('Error deleting file');
        //  });
      
         promises.push(deleteObject(fileRef[i]));
      }
      
      console.log("promises arr:" ,promises)
      Promise.all(promises).then(()=> {
        console.log("All files deleted");
      })
    } 
  }
},[deletefile_firebase])

  return (
    <div className='w-[780px] bg-white shadow-sm'>
       

    <div className='flex  py-2 w-full px-2'>
      <div className='w-1/2 flex gap-3 '>
      <div>
      <div className='mx-auto  w-10 h-10 rounded-3xl  shadow-md overflow-hidden'>
                   <img src={`${profileImage && profileImage}`} alt=""  />
                </div>
      </div>
      <div>
        <h1 className=''>
          <span className=' text-black font-bold text-xl'>{username}</span>
        </h1>
        <p className='text-sm font-semibold font-sans text-green-400'>{status === "true" ? "Online" :"Offline"}</p>
      </div>
      </div>

      <div className='text-right w-1/2 '>
         <button className='text-2xl text-black font-bold mx-3' onClick={ShowMsgsettingsBox}>:</button>

        {MsgSettingDropDown && 
         <div className='w-[24rem] px-2 absolute top-24  flex flex-row-reverse z-10'>

         <div className=' w-44 p-2 rounded bg-gray-200 text-left '>

         <div 
         className=' py-3 text-md px-2 rounded hover:bg-gray-400  cursor-pointer transition-colors  duration-200 ease-linear' >
            Message Info
          </div>

         <div 
         className=' py-3 text-md px-2 rounded hover:bg-gray-400  cursor-pointer transition-colors duration-200 ease-linear'
         onClick={show_Checkbox_onMessages}
         > Select message
          </div>
         <div onClick={Send_DeleteMsg_Details}
          className=' py-3 text-md px-2 rounded hover:bg-gray-400 cursor-pointer transition-colors  duration-200 ease-linear'
         >
          Delete message
         </div>
         </div>
        </div>}

      </div>
      
    </div>
 </div>
  )
}
