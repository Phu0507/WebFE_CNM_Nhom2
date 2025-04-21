import EmojiPicker from "emoji-picker-react";
import React, { useState, useEffect, useRef } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  Text,
  Button,
  HStack,
  Spinner,
  Input,
  VStack,
  Flex,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { FaArrowLeft, FaPhone, FaVideo } from "react-icons/fa";
import { getSender } from "../../config/ChatLogic";
import socket from "../../context/socket";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import {
  RiImageLine,
  RiAttachmentLine,
  RiDeleteBin6Line,
  RiEdit2Line,
  RiUserLine,
  RiMore2Line,
  RiGroupLine,
  RiDeleteBinLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import RenameGroupModel from "./RenameGroupModel";
import AddUserModal from "./AddUserModal";
import UserGroupModal from "./UserGroupModal";
import DeleteGroupModal from "./DeleteGroupModal";
import DeleteUserModal from "./DeleteUserModal";

// const socket = io("http://localhost:5000", {
//   transports: ["websocket"],
// });

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const navigate = useNavigate(); // Khởi tạo hook điều hướng
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hovered, setHovered] = useState(false);

  const prevChatId = useRef(null);

  const [isRenameOpen, setRenameOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isLeaveOpen, setLeaveOpen] = useState(false);

  // const sendMessage = async () => {
  //   if (!newMessage.trim()) return;
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:5000/api/message",
  //       { content: newMessage, chatId: selectedChat._id },
  //       { headers: { Authorization: `Bearer ${user.token}` } }
  //     );
  //     socket.emit("newMessage", res.data);
  //     setNewMessage("");
  //   } catch (err) {
  //     console.error("Lỗi gửi tin:", err);
  //   }
  // };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    const formData = new FormData();
    formData.append("chatId", selectedChat._id);
    if (newMessage.trim()) formData.append("content", newMessage);
    if (selectedFile) {
      formData.append("file", selectedFile);

      const fileType = selectedFile.type;
      const type = fileType.startsWith("image/") ? "image" : "file";
      formData.append("type", type);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/message",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newMsg = res.data;
      // setMessages((prev) => [...prev, newMsg]);
      socket.emit("newMessage", newMsg);
      setNewMessage("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
      alert("Gửi tin nhắn thất bại");
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji); // Thêm emoji vào tin nhắn
    setShowEmojiPicker(false); // Đóng emoji picker sau khi chọn emoji
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
      alert("Bạn chỉ có thể thu hồi tin nhắn trong ngày.");
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
    if (!selectedChat) return;

    if (prevChatId.current !== selectedChat._id) {
      prevChatId.current = selectedChat._id;

      const fetchMessages = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(
            `http://localhost:5000/api/message/${selectedChat._id}`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          setMessages(data);
          setLoading(false);
        } catch (err) {
          console.error("Lỗi tải tin nhắn:", err);
        }
      };

      fetchMessages();

      socket.emit("joinChat", selectedChat._id);
    }

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

    socket.on("messageReceived", handleMessage);
    socket.on("messageRecalled", handleRecall);

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
              <VStack gap={0} align="start">
                <HStack
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Text fontWeight="bold">{selectedChat.chatName}</Text>

                  {hovered && (
                    <Button
                      size="2xs"
                      variant={"subtle"}
                      onClick={() => setRenameOpen(true)}
                    >
                      <RiEdit2Line />
                    </Button>
                  )}
                </HStack>
                <Flex
                  fontSize="smaller"
                  color="gray.600"
                  align="center"
                  cursor="pointer"
                  _hover={{ color: "blue.500" }}
                >
                  <RiUserLine style={{ marginRight: "4px" }} />
                  {selectedChat.users?.length} thành viên
                </Flex>
              </VStack>
            )}
            <HStack>
              {!selectedChat.isGroupChat ? (
                <>
                  <Button variant="ghost" size="xs" gap="0">
                    <FaPhone></FaPhone>
                  </Button>
                </>
              ) : (
                <AddUserModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              )}
              <Button
                variant="ghost"
                size="xs"
                gap="0"
                onClick={handleVideoCall}
              >
                <FaVideo></FaVideo>
              </Button>
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button variant="outline" p={1} size={"xs"}>
                    <RiMore2Line />
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {/* Thành viên nhóm - chỉ hiện nếu là nhóm */}
                      {selectedChat?.isGroupChat && (
                        <Menu.Item
                          value="members"
                          cursor="pointer"
                          onClick={() => setUserOpen(true)}
                        >
                          Thành viên nhóm
                          <Menu.ItemCommand>
                            <RiGroupLine />
                          </Menu.ItemCommand>
                        </Menu.Item>
                      )}

                      <Menu.Separator />

                      {/* Nếu là nhóm */}
                      {selectedChat?.isGroupChat ? (
                        selectedChat.groupAdmin?._id === user._id ? (
                          // Là trưởng nhóm => Hiện "Giải tán nhóm"
                          <Menu.Item
                            value="disband"
                            cursor="pointer"
                            color="red.600"
                            onClick={() => setDeleteOpen(true)}
                          >
                            Giải tán nhóm
                            <Menu.ItemCommand>
                              <RiDeleteBinLine />
                            </Menu.ItemCommand>
                          </Menu.Item>
                        ) : (
                          // Không phải trưởng nhóm => Hiện "Rời nhóm"
                          <Menu.Item
                            value="leave"
                            cursor="pointer"
                            color="red.600"
                            onClick={() => setLeaveOpen(true)}
                          >
                            Rời nhóm
                            <Menu.ItemCommand>
                              <RiLogoutBoxRLine />
                            </Menu.ItemCommand>
                          </Menu.Item>
                        )
                      ) : null}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
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
                  setMessages={setMessages}
                />
              </div>
            )}
            <VStack
              spacing={2}
              mt={2}
              pt={3}
              align="stretch"
              borderTop="1px solid"
              borderColor="gray.300"
            >
              <HStack>
                {/* Image Input */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="imageUpload"
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                    e.target.value = ""; // Cho phép chọn lại cùng một file
                  }}
                />
                <label htmlFor="imageUpload">
                  <RiImageLine size={20} cursor="pointer" />
                </label>

                {/* File Input (non-image) */}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt"
                  style={{ display: "none" }}
                  id="fileUpload"
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                    e.target.value = ""; // Cho phép chọn lại cùng một file
                  }}
                />
                <label htmlFor="fileUpload">
                  <RiAttachmentLine size={20} cursor="pointer" />
                </label>

                <Input
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // Ngăn xuống dòng nếu đang dùng textarea
                      sendMessage(); // Gọi hàm gửi tin nhắn
                    }
                  }}
                  variant={"subtle"}
                />

                <div style={{ position: "relative", display: "inline-block" }}>
                  <Button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    variant="ghost"
                  >
                    😀
                  </Button>

                  {showEmojiPicker && (
                    <div
                      style={{
                        position: "fixed",
                        bottom: "80px",
                        right: "0",
                        zIndex: 1000,
                        background: "#fff",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        borderRadius: "8px",
                      }}
                    >
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                  )}
                </div>

                <Button onClick={sendMessage} backgroundColor={"blue.600"}>
                  Gửi
                </Button>
              </HStack>

              {/* Render ảnh hoặc file đã chọn */}
              {selectedFile && (
                <Box
                  p={2}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="gray.100"
                  maxW="100px"
                  borderColor="gray.300"
                  position="relative" // Thêm position relative để có thể định vị các phần tử con
                >
                  {/* Nút "Xóa" nằm ở góc trên bên phải */}
                  <Button
                    onClick={() => setSelectedFile(null)}
                    position="absolute" // Định vị nút ở vị trí tuyệt đối
                    top={0} // Đặt ở vị trí trên cùng
                    right={0} // Đặt ở vị trí bên phải
                    zIndex={1} // Đảm bảo nút luôn hiển thị trên ảnh
                    variant={"ghost"}
                    size={"xs"}
                  >
                    <RiDeleteBin6Line />
                  </Button>

                  {/* Hiển thị ảnh nếu là file ảnh */}
                  {selectedFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="preview"
                      style={{
                        maxHeight: "100px",
                        borderRadius: "8px",
                        objectFit: "cover", // Đảm bảo ảnh không bị kéo dài
                      }}
                    />
                  ) : (
                    <Text truncate fontSize="md">
                      📎{selectedFile.name}
                    </Text> // Hiển thị tên file nếu không phải ảnh
                  )}
                </Box>
              )}
            </VStack>
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
      {isRenameOpen && (
        <RenameGroupModel
          isOpen={isRenameOpen}
          onClose={() => setRenameOpen(false)}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
        />
      )}
      {isUserOpen && (
        <UserGroupModal
          isOpen={isUserOpen}
          onClose={() => setUserOpen(false)}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
        />
      )}
      {isDeleteOpen && (
        <DeleteGroupModal
          isOpen={isDeleteOpen}
          onClose={() => setDeleteOpen(false)}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
        />
      )}
      {isLeaveOpen && (
        <DeleteUserModal
          isOpen={isLeaveOpen}
          onClose={() => setLeaveOpen(false)}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          userToDelete={user}
        />
      )}
    </>
  );
};

export default SingleChat;
