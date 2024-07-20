
// import UserList from '../components/UserList'
// import SearchBox from '../components/SearchBox'
import React, {  Suspense} from 'react'
import { Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import MessagesDisplay from './MessagesDisplay'

const SearchBox = React.lazy(()=>import("../components/SearchBox"))
const UserList = React.lazy(()=>import("../components/UserList"))

export default function UserAccountList() {
  return (
    <div >
      
      <div style={{position:"absolute", top:"0"}}>
       <Suspense>
       <SearchBox />
       </Suspense>
      </div>


       <div className='flex ' style={{height:"100%"}}>
       <div className=' mt-14'>
          <div className='w-[450px] h-full  overflow-y-scroll overflow-x-hidden' style={{scrollbarWidth:"thin"}}> 
            <Suspense >
            <UserList/>
            </Suspense>
          </div>
        </div>

   
      <Routes>
        <Route index element={
          <Suspense fallback={<div>Loading...</div>}>
            <MessagesDisplay />
          </Suspense>
        }  />
        <Route path={`message/:userId/:username/:profileImage`} element={
          <Suspense fallback={<div>Loading...</div>}>
            <MessagesDisplay />
          </Suspense>
        } />
      </Routes> 
       </div>

     
       </div>
  
  )
}
