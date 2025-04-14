import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Text, Button, HStack, Spinner, Input } from "@chakra-ui/react";
import { FaArrowLeft, FaPhone, FaVideo } from "react-icons/fa";
import { getSender } from "../../config/ChatLogic";
// import socket from "../../context/socket";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { io } from "socket.io-client";
import ScrollableChat from "./ScrollableChat";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const navigate = useNavigate(); // Khởi tạo hook điều hướng
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/message",
        { content: newMessage, chatId: selectedChat._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      socket.emit("newMessage", res.data);
      setNewMessage("");
    } catch (err) {
      console.error("Lỗi gửi tin:", err);
    }
  };

  const recallMessage = async (messageId) => {
    const message = messages.find((msg) => msg._id === messageId);

    if (message?.isRecalled) {
      alert("Tin nhắn này đã được thu hồi rồi.");
      return;
    }

    const messageDate = new Date(message.createdAt);
    const today = new Date();

    const isSameDay =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    if (!isSameDay) {
      alert("Chỉ có thể thu hồi tin nhắn được gửi hôm nay.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/message/recall/${messageId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isRecalled: true } : msg
        )
      );

      socket.emit("recallMessage", { _id: messageId });
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi thu hồi tin nhắn";
      alert(msg);
      console.error("Error recalling message:", err);
    }
  };

  const deleteMessageForMe = async (messageId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/message/delete-for-me/${messageId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi xóa tin nhắn");
    }
  };

  useEffect(() => {
    if (!selectedChat) return; // Kiểm tra null/undefined

    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    const handleRecall = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMsg._id ? { ...msg, isRecalled: true } : msg
        )
      );
    };
    socket.emit("joinChat", selectedChat._id);
    socket.on("messageReceived", handleMessage);
    socket.on("messageRecalled", handleRecall);

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/message/${selectedChat._id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMessages(data);
        console.log("du lie", data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi tải tin nhắn:", err);
      }
    };

    fetchMessages();

    return () => {
      socket.off("messageReceived", handleMessage);
      socket.off("messageRecalled", handleRecall);
    };
  }, [selectedChat, user.token]);

  // useEffect(() => {
  //   // Kết nối với server socket.io
  //   socket.on("connect", () => {
  //     console.log("Connected to server with socket id:", socket.id); // Kiểm tra kết nối
  //   });

  //   // Lắng nghe sự kiện cuộc gọi đến
  //   socket.on("incoming call", (data) => {
  //     console.log("Incoming call data:", data);
  //     console.log(`Bạn có muốn nhận cuộc gọi từ ${data.callerID}?`);

  //     // Giả lập đồng ý cuộc gọi
  //     const acceptCall = true;
  //     if (acceptCall) {
  //       console.log(
  //         `Chấp nhận cuộc gọi và chuyển hướng tới phòng: ${data.roomID}`
  //       );
  //       navigate(`/room/${data.roomID}`);
  //     } else {
  //       console.log(`Từ chối cuộc gọi từ ${data.callerID}`);
  //       socket.emit("decline call", { callerID: data.callerID });
  //     }
  //   });

  //   return () => {
  //     socket.off("incoming call");
  //     socket.off("connect");
  //   };
  // }, [navigate]);

  const handleVideoCall = () => {
    // if (selectedChat && user) {
    //   const roomID = selectedChat._id;
    //   const users = selectedChat.users;
    //   // Gửi thông báo cuộc gọi cho các user trong room
    //   console.log(socket.connected); // In ra true nếu kết nối đang hoạt động
    //   socket.emit("call group", {
    //     roomID,
    //     callerID: user._id,
    //     members: users.map((u) => u._id),
    //   });
    //   console.log(roomID);
    //   console.log(user._id);
    //   console.log(users.map((u) => u._id));
    //   // Điều hướng sang phòng gọi
    //   navigate(`/room/${roomID}`);
    // }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            frontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <Button
              variant="ghost"
              size="xs"
              gap="0"
              onClick={() => setSelectedChat("")}
              display={{ base: "flex", md: "none" }}
            >
              <FaArrowLeft></FaArrowLeft>
            </Button>
            {!selectedChat.isGroupChat ? (
              <>{getSender(user, selectedChat.users)}</>
            ) : (
              <>{selectedChat.chatName}</>
            )}
            <HStack>
              <Button variant="ghost" size="xs" gap="0">
                <FaPhone></FaPhone>
              </Button>
              <Button
                variant="ghost"
                size="xs"
                gap="0"
                onClick={handleVideoCall}
              >
                <FaVideo></FaVideo>
              </Button>
            </HStack>
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            overflow={"hidden"}
            borderRadius={"lg"}
          >
            {loading ? (
              <Spinner size={"xl"} alignSelf={"center"} margin={"auto"} />
            ) : (
              <div
                className="message"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat
                  messages={messages}
                  recallMessage={recallMessage}
                  deleteMessageForMe={deleteMessageForMe}
                />
              </div>
            )}
            <HStack mt={3}>
              <Input
                placeholder="Nhap text"
                variant="subtle"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button
                colorPalette={"blue"}
                variant={"solid"}
                onClick={sendMessage}
              >
                Gui
              </Button>
            </HStack>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h="100%"
        >
          <Text frontSize="3xl" pb={3} fontFamily="Work sans">
            toi la ai
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
