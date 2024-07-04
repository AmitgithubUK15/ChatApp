import { createContext, useContext, useMemo } from "react";
import {io} from 'socket.io-client';

const SocketProvide = createContext(null);

export const useSocket = ()=>{
    const socket = useContext(SocketProvide);
    return socket;
}

export default function SocketProvider({children}) {

 const socket = useMemo(()=>(io(import.meta.env.VITE_APP_SOCKET_URI)),[]);
  return (
    <SocketProvide.Provider value={socket}>
      {children}
    </SocketProvide.Provider>
  )
}
