import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { toaster } from "../../components/ui/toaster";
import axios from "axios";
import { Box, Button, Stack, Text, HStack } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogic";
import ChatAvatars from "../../config/ChatAvatars";
import GroupChatModal from "./GroupChatModal";
import { RiUserLine, RiAddLine, RiUserAddLine } from "react-icons/ri";
import socket from "../../context/socket";

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedInUser, setLoggedInUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")));
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get("/api/chat", config);
        setChats(data);
        setLoading(false);
      } catch (error) {
        toaster.create({
          title: "Failed to load the chats",
          type: "error",
        });
        setLoading(false);
      }
    };
    fetchChats();
  }, [fetchAgain, setChats, user.token]);

  useEffect(() => {
    if (!user) return;

    socket.emit("setup", user._id);

    socket.on("admin:transferred", ({ chatId, newAdminId }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId
            ? { ...chat, groupAdmin: { _id: newAdminId } }
            : chat
        )
      );

      if (selectedChat?._id === chatId) {
        setSelectedChat((prev) => ({
          ...prev,
          groupAdmin: { _id: newAdminId },
        }));
      }
      // toaster.create({
      //   title: "Chuyển quyền trưởng nhóm",
      //   description: `Quyền trưởng nhóm ${selectedChat.chatName} đã chuyển cho người khác`,
      //   type: "info",
      // });
    });

    socket.on("group:new", (newGroup) => {
      setChats((prevChats) => [newGroup, ...prevChats]);
      console.log("Nhận được nhóm mới từ server qua socket:", newGroup);
      toaster.create({
        title: "Nhóm mới",
        description: `Bạn được thêm vào nhóm "${newGroup.chatName}" .`,
        type: "info",
      });
    });
    socket.on("group:info", (message) => {
      toaster.create({
        title: `${message}`,
        type: "info",
      });
    });
    return () => {
      socket.off("admin:transferred");
      socket.off("group:new");
      socket.off("group:info");
    };
  }, [user, selectedChat, setChats, setSelectedChat]);

  useEffect(() => {
    if (!user) return;

    const handleGroupUpdated = (updatedChat) => {
      setChats((prevChats) => {
        const alreadyExists = prevChats.some(
          (chat) => chat._id === updatedChat._id
        );

        if (alreadyExists) {
          return prevChats.map((chat) =>
            chat._id === updatedChat._id ? updatedChat : chat
          );
        } else {
          return [updatedChat, ...prevChats];
        }
      });

      if (selectedChat && updatedChat._id === selectedChat._id) {
        const oldUserIds = selectedChat.users.map((u) => u._id.toString());
        const newUsers = updatedChat.users.filter(
          (u) => !oldUserIds.includes(u._id.toString())
        );

        if (newUsers.length > 0) {
          const names = newUsers.map((u) => u.fullName).join(", ");
          toaster.create({
            title: `${names} đã được thêm vào nhóm!`,
            type: "info",
          });
        }

        setSelectedChat(updatedChat);
      }
    };

    socket.on("group:updated", handleGroupUpdated);

    return () => {
      socket.off("group:updated", handleGroupUpdated);
    };
  }, [user, selectedChat, setChats, setSelectedChat]);

  useEffect(() => {
    socket.on("group:removed", (chatId) => {
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
      }
      toaster.create({
        title: `Bạn bị xóa khỏi nhóm ${selectedChat.chatName} `,
        type: "info",
      });
    });

    return () => {
      socket.off("group:removed");
    };
  }, [setChats, selectedChat, setSelectedChat]);

  useEffect(() => {
    socket.on("group:deleted", ({ chatId }) => {
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));

      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
      }
      // toaster.create({
      //   title: `Trưởng nhóm đã giải tán nhóm ${selectedChat.chatName}`,
      //   type: "info",
      // });
    });

    return () => {
      socket.off("group:deleted");
    };
  }, [setChats, selectedChat, setSelectedChat]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={1}
        px={2}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>Đoạn chat</Text>
        <Box display="flex">
          <Button variant="ghost" size="xs" gap="0">
            <RiUserLine />
            <RiAddLine />
          </Button>
          <GroupChatModal></GroupChatModal>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={2}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loading ? (
          <ChatLoading />
        ) : (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat?._id === chat._id ? "#3399FF" : "#E8E8E8"}
                color={selectedChat?._id === chat._id ? "white" : "black"}
                px={3}
                py={3}
                borderRadius="lg"
              >
                <HStack>
                  <ChatAvatars loggedInUser={loggedInUser} chat={chat} />
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedInUser, chat.users)
                      : chat.chatName}
                  </Text>
                </HStack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
