import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {gql, useMutation} from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/user/userSlice';


const LOGIN_USER = gql`
 mutation Login($email:String!,$password:String!){
signinUser(email:$email,password:$password){
 msg,
 candidate{
 _id
 username
 }
}
 }
`

export default function Login() {
    const [Showpassword,setShowPassword] = useState(false);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [signinUser,{data,loading,error}] = useMutation(LOGIN_USER);
    const navigate = useNavigate();
    const Dispatch = useDispatch();
    

  
    
    function showPassword(){
        setShowPassword(true);
     }
   
     function hidePassword(){
       setShowPassword(false);
     }
 

     
     useEffect(()=>{
      
       if(data){
        setEmail('')
      setPassword('')
      alert(data.signinUser.msg);
      Dispatch(loginSuccess(data.signinUser.candidate._id))
      
      navigate("/home")
       }
     },[data])


     async function SigninUser(e){
      e.preventDefault();
      try {
         await signinUser({variables:{email,password}})
        
      } catch (error) {
        console.log(error);
      }
     }

  return (
    
    <div className='flex items-center h-full'>
      <div className=' w-[500px] mx-auto border bg-zinc-200 rounded-lg'>
        <div className='flex flex-col gap-5 my-5'>

           <div className='text-center my-3 flex gap-2 mx-auto'>
            <h1 className=' text-3xl font-bold '>
              
               <span className=' text-purple-500'>Snicker</span>
               <span className=' text-purple-600'>Talk</span>
               
            </h1>
            <div >
            <img src="/public/images/message_11842947.png" width="45"  height="40"/>
            </div>
           </div>

           <div className='my-3' >
           <form onSubmit={SigninUser} className='flex flex-col gap-5 mx-3'>

              <div className=' border my-2 overflow-hidden rounded-md'>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
              className=' w-full p-3 outline-none font-sens text-gray-500 ' placeholder='Enter Email'/>
              </div>

              <div className='bg-white flex border my-2  overflow-hidden rounded-md'>

              <input type={Showpassword === true ? "text": "password"} value={password} onChange={(e)=>setPassword(e.target.value)}
               className=' w-full p-3 outline-none font-sans text-gray-500' placeholder='Enter Password' />

              <div className=' m-2'
              onMouseEnter={showPassword} onMouseLeave={hidePassword}   >

                 <FontAwesomeIcon  icon={Showpassword ? faEyeSlash : faEye} />
                 </div>

              </div>

              <div className='border my-2  overflow-hidden rounded-md'>
              <button type="submit" 
              className=' w-full p-3 outline-none bg-purple-600 font-bold text-white text-xl hover:bg-purple-800 transition-all ease-in'>
               {loading ? "Loging...":" Login"}
              </button>
              </div>

           </form>

           <p className='text-red-500  text-center'>{error && error.message}</p>
           </div>
        </div>
      </div>
    </div>
  )
}
