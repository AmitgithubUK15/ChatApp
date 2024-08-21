import React, { lazy, Suspense } from 'react'

const SearchBox = lazy(()=>import("../components/SearchBox"))
const UserDetailsUpdate = lazy(()=>import("../components/UserDetailsUpdate"))
const HeroImage = lazy(()=>import("../components/HeroImage"))

export default function Account() {
  return (
    <div>
      
    <div className='absolute'>
     <Suspense>
     <SearchBox />
     </Suspense>
    </div>


     <div className='flex ' style={{height:"100%"}}>
     <div className='mt-16'>
        <div className='w-[417px] h-screen overflow-y-scroll overflow-x-hidden' style={{scrollbarWidth:"thin"}}> 
          <Suspense >
          <UserDetailsUpdate/>
          </Suspense>
        </div>
      </div>

 
      <Suspense>
        <HeroImage />
      </Suspense>
     
     </div>

   
     </div>
  )
}
