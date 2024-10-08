import { createContext, useContext,useEffect, useState} from "react";
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
  let websocket;
  if (S_UID !== null && socket === null) {
    websocket = io(import.meta.env.VITE_APP_SOCKET_URI, {
      query: { userID: S_UID._id },
      transports: ['websocket', 'polling'],
    });
    setSocket(websocket);
  }

  // Cleanup function to close the socket connection
  return () => {
    if (websocket) {
      websocket.disconnect();
      setSocket(null);  // Clear socket state
    }
  };
},[S_UID])
 
  return (
    <SocketProvide.Provider value={socket}>
      {children}
    </SocketProvide.Provider>
  )
}


//  const socket = useMemo(()=>(io(import.meta.env.VITE_APP_SOCKET_URI)),[]);
