import {GoogleAuthProvider,getAuth,signInWithPopup} from 'firebase/auth';
import app from '../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { loginSuccess } from '../redux/user/userSlice';
import { setUserDetails } from '../redux/user/userRelatedDetails';

const Login_Google = gql`
 mutation Login($username:String!,$email:String!,$avatar:FileMsg_Response){
Googlelogin(username:$username,email:$email,avatar:$avatar){
 msg,
 candidate{
 _id
 username,
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

export default function GoogleAuth() {
  const [Googlelogin,{data,loading}] = useMutation(Login_Google);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useMemo(()=>{
     if(data){
        
         dispatch(loginSuccess({_id:data.Googlelogin.candidate._id}))
         dispatch(setUserDetails(data.Googlelogin.candidate))
         alert(data.Googlelogin.msg);
         navigate("/rooms")
     }
  },[data])

  async function handleGoogleAuthResponse(){
    try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        const result = await signInWithPopup(auth,provider);

        let profile = {
          filename:"",
          size:"",
          type:"",
          url:result.user.photoURL
        }
        await Googlelogin({variables:{username:result.user.displayName,email:result.user.email,avatar:profile}})
    } catch (error) {
        console.log(error.message);
    }
  }
    
  return (
    <div className='border  overflow-hidden rounded-md'>
              <button type='button'  onClick={handleGoogleAuthResponse}
              className=' w-full p-3 outline-none bg-red-600 font-bold text-white text-xl hover:bg-red-800 transition-all ease-in'>
               {loading ? "Loging...":"Continue with Google"}
              </button>
    </div>
  )
}
