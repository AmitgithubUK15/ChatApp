import { createContext, useContext,useEffect,useMemo, useState} from "react";
import { useSelector } from "react-redux";
import {io} from 'socket.io-client';

const SocketProvide = createContext(null);

export const useSocket = ()=>{
    const socket = useContext(SocketProvide);
    return socket;
}

export default function SocketProvider({children}) {


const [socket ,setSocket] = useState(null);
const {S_UID}  = useSelector((state)=>state.user);



useEffect(()=>{
  if(S_UID !== null && socket === null){
    const websocket = io(import.meta.env.VITE_APP_SOCKET_URI,{
      query:{S_UID}
    });
    setSocket(websocket);
  }
  else{
   setSocket(null);
  }
},[S_UID])
 
  return (
    <SocketProvide.Provider value={socket}>
      {children}
    </SocketProvide.Provider>
  )
}


//  const socket = useMemo(()=>(io(import.meta.env.VITE_APP_SOCKET_URI)),[]);
