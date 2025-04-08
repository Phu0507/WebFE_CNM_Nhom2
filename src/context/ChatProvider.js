import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thay vì useHistory

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo); // Nếu có thông tin người dùng trong localStorage, set vào state
    } else {
      navigate("/"); // Nếu không có, điều hướng đến trang chủ hoặc trang đăng nhập
    }
  }, [navigate]); // Lưu ý cập nhật dependency list

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
