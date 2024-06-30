import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function Socket() {
  const [createConnection,setConnection] = useState(false);
  const [user,setUser] = useState();
  useEffect(() => {
    
    const socket = io(import.meta.env.VITE_APP_SOCKET_URI,{
      autoConnect:createConnection,
    });
   
    
    
    socket.on('connect', () => {
      console.log('Connected:', socket.id);
      setUser(socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
      setUser(null);
    });

    
    return () => {
      socket.disconnect();
    };
  }, [createConnection]);


  return (
    <>
      <h1>Chat App</h1>
      <button onClick={()=>setConnection(true)}>Connect</button>
      <button onClick={()=>setConnection(false)}>Disconnect</button>
      <h2>{user}</h2>
    </>
  );
}

export default Socket;
