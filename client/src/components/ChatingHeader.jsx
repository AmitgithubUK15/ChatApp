import { gql, useMutation } from '@apollo/client';
import  { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  remove_ui_msg, Selected_Msgs, ShowCheckBoxs_Visiblity, ShowMsgSettingDropDownBox } from '../redux/chatinguserlist/ChatList';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import app from '../firebase';
import { showMsgInfo } from '../redux/chatinguserlist/MessageInfoSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { showUserDetailspage } from '../redux/user/UserDetailsPageslice';
import { chatinguserLists, showMessageDisplay } from '../redux/Messagedisplay/MessagedisplaySlice';

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
  const {currentuser} = useSelector((state)=>state.currentchatuser);
  const {visible_userdetailspage} = useSelector((state)=>state.userdetailspage);

  // const {userId,username,profileImage}  = useParams();

  const [CheckUserOnline,{data}] = useMutation(CheckUserOnlineOrNot);
  const [DeleteUserMsg] = useMutation(Deletemessages_Mutation);
  const [status,setStatus] = useState(null);
  const {MsgSettingDropDown,Selection_Check_Visible} = useSelector((state)=>state.chat);
  const dispatch = useDispatch();
  const [deletefile_firebase,setDeletefile_firebase] = useState(false);


  async function UserStatus(){
     try {
       await CheckUserOnline({variables:{user_id:currentuser.userId}})
     } catch (error) {
       console.log(error.message)
     }
  }

  useEffect(()=>{
     UserStatus();
  },[currentuser])

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
 if(selectedmsg.Messages_id.length ===0 && selectedmsg.filemsgs_details.length ===0){
   alert("Please select 1 message to Delete message")
   dispatch(ShowMsgSettingDropDownBox(false))
  }
  else{
  try {
    dispatch(remove_ui_msg())
    let deletemsgobject = {
      msg_id:selectedmsg.Messages_id,
    }
    
    let {data} = await DeleteUserMsg({variables:{senderId:S_UID._id,reciverID:currentuser.userId,msgsId:deletemsgobject}})
    
    if(data){
      setDeletefile_firebase(!deletefile_firebase ? true : false)
    }
   } catch (error) {
    console.log(error.message)
   }
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
      // Reference to the file in Firebase Storage
      const storage = getStorage(app);
      const fileRef = [];

       for (let i =0; i<selectedmsg.filemsgs_details.length; i++){
        const file = ref(storage,selectedmsg.filemsgs_details[i].filename);
       
        fileRef.push(file);
      }

      console.log("fileref",fileRef)
      let promises = [];

      for(let i=0; i<fileRef.length; i++){
         promises.push(deleteObject(fileRef[i]));
      }
      
      console.log("promises arr:" ,promises)
      Promise.all(promises).then(()=> {
        console.log("All files deleted");
      })
    } 
  }
},[deletefile_firebase])


// handle show_message_Info function 

function show_message_Info(){
  
  if(selectedmsg.Messages_id.length > 0 && selectedmsg.Messages_id.length <=1){
    dispatch(showMsgInfo(true))
    dispatch(ShowMsgSettingDropDownBox(false))
  }
  else{
    alert("Please select 1 message to check message information.")
    let clearSelectmsg = {
      Messages_id:[],
      filemsgs_details:[]
    }
    dispatch(ShowCheckBoxs_Visiblity(false))
    dispatch(Selected_Msgs(clearSelectmsg))
    dispatch(ShowMsgSettingDropDownBox(false))

  }
}


// handle show Userdetails page

function GotoUserdetails(){
 if(!visible_userdetailspage){
  dispatch(showUserDetailspage(true))
}
else{
dispatch(showUserDetailspage(false))
}
}


function handleChatboxvisiblity(){
  dispatch(showMessageDisplay(false));
  dispatch(chatinguserLists(true));
}

  return (
    <div className='2xl:w-full 1xl:w-full xl:w-full  1lg:w-full lg:w-full 1md:w-full md:w-full bg-white shadow-sm'>
       

    <div className='flex  py-2 w-full px-2'>
      <div className='2xl:w-1/2  xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-1/2 xs:w-1/2
      flex gap-3 cursor-pointer' onClick={GotoUserdetails}>

      <div>
     <button onClick={handleChatboxvisiblity} className=' text-2xl font-bold 2xl:hidden xl:hidden lg:hidden md:hidden sm:block xs:block'>
       <FontAwesomeIcon icon={faArrowLeft} />
      </button>
     </div>
     
      <div>
      <div className='mx-auto  w-10 h-10  rounded-full  shadow-md overflow-hidden'>
          <img src={`${currentuser && currentuser.useravatar.url}`} alt=""  className='w-full h-full' />
      </div>
      </div>
      
      <div>
        <h1 className=''>
          <span className=' text-black font-bold text-xl  2xl:w-full 1xl:w-full xl:w-full 1lg:w-full lg:w-full 1md:w-full md:w-full sm:w-28 xs:w-16   overflow-hidden truncate'>{currentuser && currentuser.username}</span>
        </h1>
        <p className='text-sm font-semibold font-sans text-green-400'>{status === "true" ? "Online" :"Offline"}</p>
      </div>
      </div>

      <div className='text-right 2xl:w-1/2  xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-1/2 xs:w-1/2 '>
         <button className='text-2xl w-10 h-full text-black font-bold mx-3' onClick={ShowMsgsettingsBox}>
         <FontAwesomeIcon icon={faEllipsisVertical} />
         </button>

        {MsgSettingDropDown && 
         <div className='2xl:w-[38rem] 2.5xl:w-[40rem] 3xl:w-[36rem] 1xl:w-[34rem] 1.5xl:w-[32rem] xl:w-[29rem] 2lg:w-[29rem] 1lg:w-[26rem] sm_lg:w-[23rem] lg:w-[20rem] 1md:w-[19rem] 2md:w-[19rem] md:w-[15rem] sm:w-[18rem] xs:w-[11rem] 
         px-2 absolute top-24  flex flex-row-reverse z-10'>

         <div className=' w-44 p-2 rounded bg-gray-200 text-left '>

         <div onClick={show_message_Info}
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
