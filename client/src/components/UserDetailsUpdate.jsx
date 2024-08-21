import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import app from '../firebase';
import { gql, useMutation } from '@apollo/client';
import { setUserDetails } from '../redux/user/userRelatedDetails';

const UpdateProfile_gql = gql`
mutation updateProfile($req_details:PorfileUpdate){
 updateUserProfile(req_details:$req_details){
 msg,
  candidate{
 _id
 username,
 email,
 avatar{
 filename,
 size,
 type,
 url
 },
 about
 }
 }
}
`

const updateUsername_gql = gql`
mutation updatename($user_id:String!, $updated_name: String!){
 updateUserName(user_id:$user_id, updated_name:$updated_name){
  msg,
  candidate{
 _id
 username,
 email,
 avatar{
 filename,
 size,
 type,
 url
 },
 about
 }
 }
}
`



const updateUser_About_gql = gql`
mutation updateabout($user_id:String!, $updated_about: String!){
  updateUser_about(user_id:$user_id, updated_about:$updated_about){
  msg,
  candidate{
 _id
 username,
 email,
 avatar{
 filename,
 size,
 type,
 url
 },
 about
 }
 }
}
`

export default function UserDetailsUpdate() {
  const [updateUserProfile] = useMutation(UpdateProfile_gql);
  const [updateUserName] = useMutation(updateUsername_gql);
  const [ updateUser_about] = useMutation(updateUser_About_gql)

  const { S_UID } = useSelector((state) => state.user);
  const { currentuser } = useSelector((state) => state.userdetails);
  const fileref = useRef();
  const [imageUrl, setImageurl] = useState();
  const [PrevDelFB, setPrevDelFB] = useState(null);
  const [UserOrignalname, setUserOrignalname] = useState(currentuser && currentuser.username);
  const [Inputedit, setInputEdit] = useState(true);
  const [InputValue, setInputValue] = useState( currentuser && currentuser.username);
  const [AboutEdit, setAboutedit] = useState(true);
  const [UserOrignalAbout,setUserOrignalabout] = useState(currentuser && currentuser.about);
  const [aboutvalue,setAboutvalue] =useState(currentuser && currentuser.about);
  const dispatch = useDispatch();
  
  
 
  
  function handle_Uploadfile() {
    fileref.current.click();
  }

  function HandleFilesubmit(file) {
    if (file.length > 0 && file.length <= 1) {
      let promise = [];

      for (let i = 0; i < file.length; i++) {
        promise.push(storeImage(file[i]));
      }

      Promise.all(promise)
        .then((urls) => {
          setImageurl(urls);
          setPrevDelFB(S_UID.avatar);
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

  async function Update_profile(){
    try {
      let userdata = {
        user_id:S_UID._id,
        image:imageUrl[0]
      }
      const {data} = await updateUserProfile({variables:{req_details:userdata}});
    
      if(data){
        alert(data.updateUserProfile.msg);
        dispatch(setUserDetails(data.updateUserProfile.candidate))

      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useMemo(() => {
    if (imageUrl) {
      Update_profile()
    }
  }, [imageUrl])



  // visible username edit input

  function EditName() {
    if (!Inputedit) {
      setInputEdit(true);
    }
    else {
      setInputValue("");
      setInputEdit(false);
    }
  }

  // save name

 async function SaveName() {
    setInputEdit(true)
    
    try {
      console.log(InputValue);
      const {data} = await updateUserName({variables:{user_id:S_UID._id, updated_name:InputValue}});

      if(data){
        alert(data.updateUserName.msg);
        dispatch(setUserDetails(data.updateUserName.candidate))

      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // cancel save

  function Cancelsave() {
    setInputEdit(true);
    setInputValue(UserOrignalname)
  }


  // visible about 

  function EditAbout(){
   if(!AboutEdit){
    setAboutedit(true);
   }
   else{
    setAboutvalue("");
    setAboutedit(false);
   }
  }

  // save about

  async function SaveAbout(){
    setAboutedit(true);
    try {

      const {data} = await  updateUser_about({variables:{user_id:S_UID._id, updated_about:aboutvalue}});
      
      if(data){
        console.log(data);
        alert(data.updateUser_about.msg);
        dispatch(setUserDetails(data.updateUser_about.candidate))
       
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function CancelAbout(){
    setAboutedit(true);
    setAboutvalue(UserOrignalAbout);
  }


  return (
    <div className=' w-full h-screen bg-gray-50'>
      <div>
        {/* for image */}
        <div>
          <div className=' w-full flex flex-col'>
            <div className='w-full overflow-hidden h-28'>
              <div className='w-full h-28 bg-gray-100'
              //  style={{
              //   backgroundImage:"url(/images/view.jpg)",
              //   backgroundPosition:"center",
              //   backgroundRepeat:"none",
              //   backgroundSize:"cover",
              //  }}
              >
                {/* <img src="/images/view.jpg" alt="" /> */}
              </div>
            </div>
            <div className='w-full h-24'>
              <div className='relative bottom-16 left-32  w-[10rem] h-36'>
                <div className='overflow-hidden mx-auto bg-gray-200 w-[9rem] h-[9rem] rounded-full border-4 border-white' style={{ boxShadow: " 0px 7px 14px #c5c5c5" }}>
                  <input type="file" hidden onChange={(e) => HandleFilesubmit(e.target.files)} ref={fileref} accept='image/png,image/jpeg' />
                  <img onClick={handle_Uploadfile} src={currentuser ? currentuser.avatar.url : "/images/pic.jpg"} alt="" className='w-full h-full object-cover' />
                </div>
              </div>
            </div>

          </div>

          <div className='w-full'>
            <div className='flex flex-col gap-3 mx-2 '>

              <div className=' '>
                <div className='flex flex-col gap-4 p-2'>
                  <p>
                    <h3 className='text-purple-500 font-semibold text-md'>Your name</h3>
                  </p>
                  <p className={`flex border-b border-gray-400 ${Inputedit === false ? "bg-gray-100" : "bg-transparent"}`} >

                    {/* username */}
                    <input type="text" disabled={Inputedit}
                      value={InputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className='w-full bg-transparent p-2 outline-none ' />

                    {Inputedit ?
                      (<button title='Edit' onClick={EditName}>
                        <div className='w-10 px-1'>
                          <img src="/images/pen.png" alt="" className='' />
                        </div>
                      </button>)
                      :
                      (
                        <div className='flex'>
                          <button onClick={Cancelsave}>
                            <div className='w-10 px-1'>
                              <img src="/images/cross-small.png" alt="" className='' />
                            </div>
                          </button>
                          <button onClick={SaveName}>
                            <div className='w-10 px-1'>
                              <img src="/images/check.png" alt="" className='' />
                            </div>
                          </button>
                        </div>
                      )
                    }
                  </p>
                </div>
              </div>

              <div className=''>
                <div className='flex flex-col gap-4 p-2'>
                  <p>
                    <h3 className='text-purple-500 font-semibold text-md'>About</h3>
                  </p>

                  <p className={`flex border-b border-gray-400 ${AboutEdit === false ? "bg-gray-100": "bg-transparent"} `} >
                    {/* about */}
                    <input type="text" disabled={AboutEdit} className='w-full bg-transparent p-2 outline-none ' 
                     value={aboutvalue} onChange={(e)=>setAboutvalue(e.target.value)}
                    />
                    {AboutEdit ?
                      (<button title='Edit' onClick={EditAbout}>
                        <div className='w-10 px-1'>
                          <img src="/images/pen.png" alt="" className='' />
                        </div>
                      </button>)
                      :
                      (
                        <div className='flex'>
                          <button onClick={CancelAbout}>
                            <div className='w-10 px-1'>
                              <img src="/images/cross-small.png" alt="" className='' />
                            </div>
                          </button>
                          <button onClick={SaveAbout}>
                            <div className='w-10 px-1'>
                              <img src="/images/check.png" alt="" className='' />
                            </div>
                          </button>
                        </div>
                      )
                    }
                  </p>
                </div>
              </div>

              <div className=''>
                <div className='flex flex-col gap-4 p-2'>
                  <p>
                    <h3 className='text-purple-500 font-semibold text-md'>Your Email</h3>
                  </p>
                  <p className='flex border-b border-gray-400 ' >
                    <input type="text" disabled value={currentuser && currentuser.email} className='w-full bg-transparent p-2 outline-none ' />
                  </p>
                </div>
              </div>



            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
