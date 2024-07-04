// chat.jsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSocket } from '../context/SocketProvider';

function Chat() {
  
  const [message, setMessage] = useState('');
  const socket = useSocket();
  const [messages,setMessages] = useState([])
  const [mid,setMid] = useState(0)


   const sendMessage =  useCallback((e)=>{
    e.preventDefault();
 
    setMid(mid+1);
    let chat = {
      msg:message,
      id:mid
    }
     socket.emit("chatMessage", {chat});

     setMessage('');
  },[socket,mid,message])


   useMemo(()=>{
    socket.on('chatMessage', ({chat }) => {
      console.log(`Message from  ${chat}`);
      setMessages((prev) => [...prev, chat]);
  })
  },[socket])
  

  useEffect(()=>{
    socket.on('chatMessage',sendMessage)
    return ()=>{
      socket.off('chatMessage',sendMessage);
    }
  },[socket])

  return (
    <>
      <h1>Chat App</h1>
        <div>
         <form onSubmit={sendMessage}>
         <input
            type="text"
            // name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message"
          />
          <button type='submit'>Send</button>
         </form>
         {messages && messages.map((value)=>(
          <p key={value.id}>{value.msg}</p>
         ))}
        </div>
     
    </>
  );
}

export default Chat;

