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

const MyChats = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedInUser, setLoggedInUser] = useState();
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

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
