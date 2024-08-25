import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showUserDetailspage } from '../redux/user/UserDetailsPageslice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function UserDetailsPage() {
    const {currentuser} = useSelector((state)=>state.currentchatuser)
    const dispatch = useDispatch();

  return (
    <div >
       <div className='flex flex-col'>
        
        <div className='px-3 py-5'>
        <button onClick={()=>dispatch(showUserDetailspage(false))}>
        <FontAwesomeIcon icon={faArrowLeft} className=' text-xl font-bold'/>
        </button>
        </div>


        <div>
        <div className=' w-full flex flex-col'>
            <div className='w-full overflow-hidden h-36 bg-gray-100'>
              <div className='w-full '
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
            <div className='w-full h-32'>
              <div className='relative bottom-24 left-72  w-52 h-48'>
                <div className='overflow-hidden mx-auto bg-gray-200 w-48 h-48 rounded-full border-4 border-white' style={{ boxShadow: " 0px 7px 14px #c5c5c5" }}>
                  <img  src={currentuser ? currentuser.useravatar.url : "/images/pic.jpg"} alt="" className='w-full h-full object-cover' />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className='flex flex-col px-4 gap-2'>
          
          <div>
            <p className='py-2'><span className='text-xl font-semibold '>Username :</span></p>
            <p className='py-2 border-b-2 '><span className='text-xl font-semibold text-gray-400'>{currentuser.username}</span></p>
          </div>

          <div>
            <p className='py-2'><span className='text-xl font-semibold '>Email :</span></p>
            <p className='py-2 border-b-2 '><span className='text-xl font-semibold text-gray-400'>{currentuser.email}</span></p>
          </div>
          <div>
            <p className='py-2'><span className='text-xl font-semibold '>About :</span></p>
            <p className='py-2 border-b-2 '><span className='text-xl font-semibold text-gray-400'>{currentuser.about}</span></p>
          </div>
        </div>



       </div>
    </div>
  )
}
