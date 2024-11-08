import io from "socket.io-client";
import React, { useEffect, useState } from "react";
function SocketIO(seed) {
    const [socket, setSocket] = useState(null);
  
    useEffect(() => {
      // 创建 Socket.IO 连接
      const socket = io('http://localhost:5001', {cors:true});
      setSocket(socket);
      
      // 监听 Socket.IO 自定义事件
      socket.on('connect', (msg) => {
          console.log(msg);
      });
      
      // 关闭 Socket.IO 连接
      return () => {
          socket.disconnect();
      };
    }, []);
  
    const handleButtonClick = (seed) => {
      // 向后端发送自定义事件
      console.log(seed);
      socket.emit('my_event', {data: 'Some data'});
    }
  
    return (
      <div className="App">
        <button onClick={handleButtonClick}>
          Send Message
        </button>
      </div>
    );
  }
  
  export default SocketIO;