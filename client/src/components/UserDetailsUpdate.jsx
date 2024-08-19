import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import app from '../firebase';

export default function UserDetailsUpdate() {
  const {S_UID} = useSelector((state)=>state.user);
  const {currentuser} = useSelector((state)=>state.userdetails);
  const fileref = useRef();
  const [imageUrl ,setImageurl] = useState();
  const [PrevDelFB,setPrevDelFB] = useState(null);
  const [Inputedit,setInputEdit] = useState(true);

 
  function handle_Uploadfile(){
    fileref.current.click();
  }

  function HandleFilesubmit(file){
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

  useMemo(()=>{
    if(imageUrl){
      console.log(imageUrl);
    }
  },[imageUrl])


  // visible username edit input

  function EditName(){
    if(!Inputedit){
      setInputEdit(true);
    }
    else{
      setInputEdit(false);
    }
  }

  return (
    <div className=' w-full h-full bg-gray-50'>
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
                      <div className='overflow-hidden mx-auto bg-gray-200 w-[9rem] h-[9rem] rounded-full border-4 border-white' style={{boxShadow:" 0px 7px 14px #c5c5c5"}}>
                      <input type="file" hidden onChange={(e)=>HandleFilesubmit(e.target.files)} ref={fileref} accept='image/png,image/jpeg' />
                         <img onClick={handle_Uploadfile} src={currentuser ? currentuser.avatar.url : "/images/pic.jpg"} alt="" className='w-full h-full object-cover' />
                      </div>
                    </div>
                    </div>
                   
                </div>

                <div>
                  <div className='flex flex-col gap-3 mx-2 '>

                    <div className=' '>
                       <div className='flex flex-col gap-4 p-2'>
                           <p>
                            <h3 className='text-purple-500 font-semibold text-md'>Your name</h3>
                           </p>
                           <p className={`flex border-b border-gray-400 ${Inputedit === false ? "bg-gray-100":"bg-transparent" }`} >
                            <input type="text" disabled={Inputedit} defaultValue={currentuser && currentuser.username}  className='w-full bg-transparent p-2 outline-none ' />
                            <button title='Edit' onClick={EditName}>
                              <div className='w-10 px-1'>
                                <img src="/images/pen.png" alt="" className='' />
                              </div>
                            </button>
                           </p>
                       </div>
                    </div>

                    <div className=''>
                      <div className='flex flex-col gap-4 p-2'>
                            <p>
                            <h3 className='text-purple-500 font-semibold text-md'>About</h3>
                           </p>
                           <p className='flex border-b border-gray-400 ' >
                            <input type="text" disabled className='w-full bg-transparent p-2 outline-none ' />
                            <button  title='Edit'>
                              <div className='w-10 px-1'>
                                <img src="/images/pen.png" alt="" className='' />
                              </div>
                            </button>
                           </p>
                       </div>
                    </div>

                    <div className=''>
                    <div className='flex flex-col gap-4 p-2'>
                           <p>
                            <h3 className='text-purple-500 font-semibold text-md'>Your Email</h3>
                           </p>
                           <p className='flex border-b border-gray-400 ' >
                            <input type="text" disabled value={currentuser && currentuser.email } className='w-full bg-transparent p-2 outline-none ' />
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
