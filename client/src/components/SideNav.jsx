

import {  useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';




export default function SideNav() {
    
    const {S_UID} = useSelector((state)=>state.user);
    



  return (
    <div className=' w-20 h-full  bg-white ' >
        <div className='flex flex-col m-2 gap-6'>
            <Link to="/account">
            <div>
                <div className='mx-auto  w-12 h-12 rounded-3xl  shadow-md overflow-hidden'>
                   <img src={`${S_UID && S_UID.avatar}`} alt=""  />
                </div>
            </div>
            </Link>
          
           <Link to="/rooms">
           <div >
                <div className='mx-auto  w-14 h-14 rounded-3xl   overflow-hidden'>
                   <img src="/images/message.png" alt=""  width={40}  className='mx-auto my-2' />
                </div>
            </div>
           </Link>
          
            <Link to="/Adduser">
            <div>
                <div className='mx-auto  w-12 h-12 rounded-3xl    overflow-hidden'>
                   <img src="/images/addchat.png" alt=""  />
                </div>
            </div>
            </Link>
            
            <Link to="/settings">
            <div >
                <div className='mx-auto  w-12 h-12 rounded-3xl   overflow-hidden'>
                   <img src="/images/setting.png" alt="" width={40}  className='mx-auto my-2' />
                </div>
            </div>
            </Link>
           

        </div>
    </div>
  )
}
