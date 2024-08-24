import React, {  Suspense, useCallback, useEffect} from 'react'
import { Route, Routes,  } from 'react-router-dom'
import MessagesDisplay from './MessagesDisplay'
import { useDispatch } from 'react-redux'
import { SelectUser, ShowChatingList_dropdown } from '../redux/chatinguserlist/ChatList'
import SearchBox from '../components/SearchBox'


// const SearchBox = React.lazy(()=>import("../components/SearchBox"))
const ChatingUserList = React.lazy(()=>import("../components/ChatingUserList"))

export default function Chat() {
const dispatch = useDispatch();

useEffect(()=>{
dispatch(ShowChatingList_dropdown(false))
dispatch(SelectUser(false))
},[])

  return (
    <div>
      
      <div className='absolute'>
       {/* <Suspense> */}
       <SearchBox />
       {/* </Suspense> */}
      </div>


       <div className='flex ' style={{height:"100%"}}>
       <div className='mt-16'>
          <div className='w-[417px] h-full  overflow-y-scroll overflow-x-hidden' style={{scrollbarWidth:"thin"}}> 
            <Suspense >
            <ChatingUserList/>
            </Suspense>
          </div>
        </div>

   
      <Routes>
        <Route index element={
          <Suspense fallback={<div>Loading...</div>}>
            <MessagesDisplay />
          </Suspense>
        }  />
        <Route path="/message" element={
          <Suspense fallback={<div>Loading...</div>}>
            <MessagesDisplay />
          </Suspense>
        } />
      </Routes> 
       </div>

     
       </div>
  )
}
