
import UserList from '../components/UserList'
import SearchBox from '../components/SearchBox'
import { useEffect } from 'react'
import { Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import MessagesDisplay from './MessagesDisplay'


export default function UserAccountList() {
  return (
    <div >
      
      <div style={{position:"absolute", top:"20px"}}>
      <SearchBox />
      </div>


       <div className='flex ' style={{height:"100%"}}>
       <div className=' mt-14 overflow-y-scroll' style={{scrollbarWidth:"none"}}>
          <div className='w-[450px]'> 
            <UserList/>
          </div>
        </div>

   
      <Routes>
        <Route index element={<MessagesDisplay />} />
        <Route path={`message/:userId`} element={<MessagesDisplay />} />
      </Routes> 
       </div>

     
       </div>
  
  )
}
