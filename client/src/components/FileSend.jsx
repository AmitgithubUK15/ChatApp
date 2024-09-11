import { useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Send_Docs, Send_File, Send_File_Data } from '../redux/chatinguserlist/ChatList';


export default function FileSend() {
  const ImageFileRef = useRef(null);
  const DocFileRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [pdfUploadedfile,setPdfUploadedfiles] = useState([]);
  const [visibleFileOption, setVisibleFileOption] = useState(false);
  const dispatch = useDispatch();
  const [data,setData] = useState();
  const [docfileData,setdocfileData] = useState()
  
  function showFileOption() {
    setVisibleFileOption(!visibleFileOption);
  }

  function handleFileChange(event) {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);

  }

  // function handleDockFileChange(event){
  //   const files = Array.from(event.target.files);
  //   setPdfUploadedfiles(files);
  // }

  useMemo(()=>{
   if(data){
    dispatch(Send_File(data))
    setUploadedFiles([])
    setPdfUploadedfiles([]);
   }
  },[data])

  useMemo(()=>{
    if(docfileData){
      dispatch(Send_Docs(docfileData))
      setUploadedFiles([])
      setPdfUploadedfiles([]);
     }
  },[docfileData])


  async function submitFiles() {
  
  if(uploadedFiles.length >0){
    
    let imageSources = [];
    if(uploadedFiles.length > 0 && uploadedFiles.length <=6){
  
      uploadedFiles.forEach((file)=>{
        const reader = new FileReader();
        reader.onload = () =>{
          imageSources.push(reader.result);
  
          if(imageSources.length === uploadedFiles.length){
            setData(imageSources);
          }
        };
        reader.readAsDataURL(file);
      })

      dispatch(Send_File_Data(uploadedFiles))
    }
    else{
      alert("Please select 1-6 files");
      
    }
  }
  // for document file uploading 
  
  // else if (pdfUploadedfile.length > 0){
  //   let pdfSources = [];
    
  //   if(pdfUploadedfile.length > 0 && pdfUploadedfile.length <=6){
  //     pdfUploadedfile.forEach((file)=>{
  //         const pdfFileUrl = URL.createObjectURL(file);
  //         console.log(pdfFileUrl);
  //         pdfSources.push(pdfFileUrl);
  //         if(pdfSources.length === pdfUploadedfile.length){
  //           setdocfileData(pdfSources);
  //         }
  //     })
  //   }
  //   else{
  //     alert("Please select 1-6 files");
      
  //   }
  // }

  else{
    alert("Please select image, video or pdf, doc, docx file");
  }
  

   
  }

 

  
  return (
    <div>
      <div>
        {visibleFileOption && (
          <div className='absolute left-0 bottom-16 w-64 h-28 bg-gray-200'>
            <div className='flex py-4 justify-center gap-2'>
              <div className='w-20 rounded-lg h-20 p-1 cursor-pointer'>
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  ref={ImageFileRef}
                  accept='image/png,image/gif,image/jpeg, video/mp4'
                  multiple
                />
                <img
                  className='w-14 h-14 mx-auto cursor-pointer'
                  src="/images/image_4725998.png"
                  alt=""
                  onClick={() => ImageFileRef.current.click()}
                />
                <p className='text-[11px] mx-5 py-1 font-semibold'>Gallary</p>
              </div>

              {/* <div className='w-20 rounded-lg h-20 p-1 cursor-pointer'>
                <input
                  type="file"
                  hidden
                  onChange={handleDockFileChange}
                  ref={DocFileRef}
                  accept='.pdf, .doc, .docx'
                  multiple
                />
                <img
                  className='w-14 h-14 mx-auto cursor-pointer'
                  src="/images/doc.png"
                  alt=""
                  onClick={() => DocFileRef.current.click()}
                />
                <p className='text-[11px] mx-6 py-1 font-semibold'>Doc</p>
              </div> */}

              <div className='w-20 rounded-lg h-20 p-1  cursor-pointer'>
              <button className='my-2 py-2 px-2 border text-white font-semibold rounded-full bg-purple-600' onClick={submitFiles}>Open</button>
              </div>
           
            </div>
          </div>
        )}
        <div onClick={showFileOption}>
          <button type='button' className='mx-auto'>
            <img src="/images/link.png" className='w-12 h-18' alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
