import React from 'react'

// import Socket from './Socket';
import Chat from './Chat';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const {S_UID} = useSelector((state)=>state.user);
  return (
    <div>
      Home
      {S_UID !== null?
      <Navigate to="/chat" />
      :
      <Navigate to="/login" />
      }
     {/* <Socket /> */}
    </div>
  )
}
