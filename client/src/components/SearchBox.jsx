import React from 'react'

export default function SearchBox() {
  return (
    <div className='w-[450px]  border-l-gray-400 ' style={{backgroundColor:"rgb(168 0 194)"}}>
       

       <div className=''>
         <form action="" className='py-3'>
          <div className=' w-80 mx-auto  flex bg-purple-700 rounded-lg overflow-hidden  '>
            <input type="text" className='p-2 w-full outline-none' placeholder='enter text'/>
            <button className='outline-none border-none p-2  text-white'>Search</button>
          </div>
         </form>
       </div>
    </div>
  )
}
