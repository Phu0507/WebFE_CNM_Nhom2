import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = () => {
  const [message, setMessage] = useState([]);
  const fetchMessages = async () => {
    const { data } = await axios.get("/api/chat"); // Lấy 'data' thay vì 'response'
    setMessage(data); // Gán 'data' vào state
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  return (
    <div>
      {message.map((msg) => (
        <div key={msg._id}>
          <p>{msg.chatName}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatPage;
