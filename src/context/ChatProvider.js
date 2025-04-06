import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thay vì useHistory

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate(); // Sử dụng useNavigate thay vì useHistory

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/"); // Dùng navigate thay vì history.push
    }
  }, [navigate]); // Lưu ý cập nhật dependency list

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
