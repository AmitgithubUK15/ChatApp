
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { FileShow_On_ChatBox, HideImage_Sending_slide, HideImageReview_Box_NotClear_ExitingValue, Send_File, Send_File_Data } from '../redux/chatinguserlist/ChatList';
import { getNullableType } from 'graphql';
import app from '../firebase';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import './index.css'
import { gql, useMutation } from '@apollo/client';
import { useNavigate} from 'react-router-dom';
import { logout, SessionExpried_Logout } from '../redux/user/userSlice';



const SendMessage = gql`
mutation Msgsend($senderId:String!,$reciverID:String!,$msg:String!,$Date:String!,$Time:String!,$Day:String!,$FileMsg:[FileMsg_Response]){
 RequestforChat(senderId:$senderId,reciverID:$reciverID,msg:$msg,Date:$Date,Time:$Time,Day:$Day,FileMsg:$FileMsg){
  ChatMsg{
  _id,
   senderId,
   msg,
   FileMsg{
   filename,
   size,
   type,
   url
   }
   Time,
  }
 }
}
`;

export default function FileReview() {
  const [RequestforChat,{loading}] = useMutation(SendMessage);
  const {S_UID,LogoutUser} = useSelector((state)=>state.user);
  const {currentuser} = useSelector((state)=>state.currentchatuser);

  const {file_url_for_review,doc_file,fileData} = useSelector((state)=>state.chat);
  const [Imageindex,setImageIndex] = useState(null);
  const [DeleteImageIndex ,setDeleteImageIndex] = useState(getNullableType);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileUrl,  setFileurl] = useState();


    // Session Expired msg and logout user

    useMemo(()=>{
      if(LogoutUser){
        alert(LogoutUser);
        dispatch(logout())
        navigate("/login")
      }
    },[LogoutUser])

  console.log("file",file_url_for_review);
  function ChangemidImage(index)  {
    setImageIndex(index);
  }

  function showdeleteButton(index){
    setDeleteImageIndex(index);
  }

  function RemoveImage(index){
    // filter imageurl for display images and remove
   let updatefiles = file_url_for_review.filter((value,i)=> i !== index );
   dispatch(Send_File(updatefiles));

  //  filter file and remove filefull details 
  
   let orignal_file_Update_data = fileData.filter((value,i)=> i!== index);
   dispatch(Send_File_Data(orignal_file_Update_data))
   setImageIndex(0);
  }

  function checkFiletype(filedetail){
   const file_urlsplit = filedetail.split(/[:;]/);
   return file_urlsplit[1];
  }
  

  function HideImageReview(){
    dispatch(HideImage_Sending_slide())
  }

// Send file Firebase Server for make image url

 async function Sendfile_inMsg() {
    if (fileData.length > 0 && fileData.length <= 5) {
      let promise = [];
  
      for (let i = 0; i < fileData.length; i++) {
        promise.push(storeImage(fileData[i]));
      }
  
      Promise.all(promise)
        .then((urls) => {
          setFileurl(urls);
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
        });
    } else {
      alert("Uploaded files must be less than 5");
    }
  }
  
  function storeImage(file) {
    console.log(file);
    return new Promise((resolve, reject) => {
      if (!file || !file.name) {
        return reject(new Error("Invalid file object"));
      }
  
      const storage = getStorage(app);
      const filename = `${new Date().getTime()}_${file.name}`;
  
      try {
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve({
                filename: filename,
                size: file.size,
                type: file.type,
                url: downloadURL,
              });
            });
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }


// Send file on Server and Chating User

useMemo(()=>{
  if(fileUrl){
    console.log(fileUrl);
    dispatch(HideImageReview_Box_NotClear_ExitingValue())
    CreateMessage();
  }
},[fileUrl])


async function CreateMessage() {

  try {
   if(fileUrl.length > 0){
    const day = ["Sunday","Monday","Tuesday","Webnesday","Thrusday","Friday","Saturday"]
    const Currentdate = new Date();
    const dayNumber = Currentdate.getDay();
    const {data} =  await RequestforChat(
      {variables:
        {
        senderId:S_UID._id,
        reciverID:currentuser.userId,
        msg:"",
        FileMsg:fileUrl,
        Date:Currentdate.toLocaleDateString(),
        Time:Currentdate.toLocaleTimeString(),
        Day:day[dayNumber]
      }
    }
  )

  if(data){
    console.log(data);
    dispatch(FileShow_On_ChatBox(data.RequestforChat.ChatMsg))
  }
   }
   else{
    console.log('fileurl length is 0')
   }

  } catch (error) {
    if(error){
      if(error.message === "Session Expired, please login"){
        dispatch(SessionExpried_Logout(error.message))
       }
    }
    else{
      console.log(error.message);
    }
  }
}



  return (
    <div className='h-full overflow-y-scroll overflow-x-hidden'>
      <div className='flex flex-col h-full'>

         <div className='border '>
           <div>
             <img onClick={HideImageReview} src="/images/cross-small.png" alt="" className='w-12 h-12 cursor-pointer'/>
           </div>
         </div>

         <div className='flex justify-center items-center h-full'>
          
          
           {file_url_for_review && (checkFiletype(file_url_for_review[0]) === 'video/mp4' || (Imageindex ? checkFiletype(file_url_for_review[Imageindex]) === 'video/mp4' : false)) ?
           (<div className='overflow-hidden w-74 h-56'>
            <video  className=' w-74 h-56' controls>
              <source src={Imageindex ? file_url_for_review[Imageindex]: ( file_url_for_review !==null  ? file_url_for_review[0] : null) } type='video/mp4'/>
              </video>
            </div>)
           :
           (<div className='overflow-hidden w-74 h-56'>
            <img src={Imageindex ? file_url_for_review[Imageindex] : ( file_url_for_review !==null  ? file_url_for_review[0] : null) } className=' w-74 h-56' />
            </div>)
            }

            {doc_file && doc_file !==null && 
            <div className='overflow-hidden w-72 h-96'>
              {null}
            </div>
           }
          
         </div>

        <div className=' border border-t-2 relative bottom-0'>
          <div className='flex py-5 mx-3'>

            {/* image list */}
            <div className='w-full'>
                <div className=' flex gap-2 justify-center'>
                {file_url_for_review && file_url_for_review.map((value, index) => (
                <div  onMouseEnter={()=>showdeleteButton(index)}
                key={index} 
                className='border-4 border-gray-400 rounded-lg cursor-pointer '
                >
                  {checkFiletype(value) === "video/mp4" ?
                  (
                    <div>
                    <img onClick={()=>ChangemidImage(index)}  src="/images/video.png" alt="" className='w-20 h-14' />
                  </div>   
                  )
                  :
                  (
                    <div>
                      <img onClick={()=>ChangemidImage(index)}  src={value} alt="" className='w-20 h-14' />
                    </div>
                  )
                   }
                 
                  
                  <div onClick={()=>RemoveImage(index)}
                  className={`absolute bottom-14 flex `} style={{display:`${DeleteImageIndex === index ? "block":"none"}`,zIndex:"1"}}>
                    <span className='w-6 h-5 inline-block bg-gray-200'>
                    <img src="/images/cross-small.png" alt="" className='w-4 h-4'/>
                    </span> 
                  </div>

                </div>
                 ))}
                </div>
            </div>

            {/* for send button */}
            <div className='w-14 h-12  border rounded-full' style={{ backgroundColor: "rgb(168 0 194)" }}>
            <button onClick={Sendfile_inMsg} type="button" className='block mx-auto py-2 bg-pu' >
                <div>
                  {loading ? "Send.." : <img src="/images/right-arrow.png" className='h-6 w-5' alt="" />}
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}


// file deleting code in firebase 
  // useMemo(()=>{
  //   if(Deletingfile === null || Deletingfile === undefined){
  //    return null;
  //   }
  //   else{
  //      if (Deletingfile) {
  //       // Reference to the file in Firebase Storage
  //       const storage = getStorage(app);
  //       const fileRef = ref(storage,Deletingfile.filename);
  //       // Delete the file
  //        deleteObject(fileRef)
  //         .then(() => {
  //           console.log("File delete successfully")
  //           // setMessage('File deleted successfully');
  //         })
  //         .catch((error) => {
  //           console.log("hee")
  //           console.error('Error deleting file:', error);
  //           // setMessage('Error deleting file');
  //         });
  //     } else {
  //       console.log("please enter file")
  //       // setMessage('Please enter a file name');
  //     }
  //   }
  // },[Deletingfile])
