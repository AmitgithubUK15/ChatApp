import { Link } from 'react-router-dom';
import { useSelector} from 'react-redux'
import "./index.css"



export default function UserList() {
const {S_UID} = useSelector((state)=>state.user);
const {Chat} = useSelector((state)=>state.chat);
  
  return (
    <div className='w-[440px] '>
      {Chat && Chat.ChatUserList.List.ConnectedUser.map((value)=>(
       <div key={value._id} >
          {value._id !== S_UID._id ? 
          (  <Link to={`message/${value._id}/${value.username}/${encodeURIComponent(value.avatar)}`} >
            <div id='listcomponent' className=' py-5 border border-b-gray-300' >       
            <div className='flex'>
              <div className='w-20 '>
                 <div className=' w-14 mx-auto overflow-hidden' style={{borderRadius:"50px"}}>
                  <img src={value.avatar} alt="" />
                 </div>
              </div>
              <div>
                <div>
                  <h1><span className=' font-bold'>{value.username}</span></h1>
                </div>
                <div>
                  <p>{value.email}</p>
                </div>
              </div>
            </div>
          </div>
         </Link>)
         :
         null}
        </div>
      ))}
    </div>
  ) 
}
