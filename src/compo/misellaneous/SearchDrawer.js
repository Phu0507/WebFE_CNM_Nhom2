import React, { useState, useEffect } from "react";
import {
  Button,
  CloseButton,
  Drawer,
  Portal,
  Text,
  Input,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { toaster } from "../../components/ui/toaster";
import axios from "axios";

const SearchDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSearchResult([]);
      setLoading(false);
      setLoadingChat(false);
    }
  }, [open]);

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearch(query);

    // Nếu chuỗi tìm kiếm trống thì không gọi API
    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/users?search=${query}`, config);
      setSearchResult(data);
      console.log("Kết quả tìm:", data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false); // Đóng drawer sau khi chọn chat
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Có lỗi xảy ra khi truy cập chat",
        type: "error",
      });
      throw new Error(err);
    }
  };
  return (
    <>
      <Drawer.Root
        placement="start"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <Drawer.Trigger asChild>
          <Button variant="ghost" size="sm">
            <FaSearch />
            <Text display={{ base: "none", md: "flex" }} px={"1"}>
              Tìm kiếm
            </Text>
          </Button>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header borderBottom="1px solid" borderColor="gray.200">
                <Box>
                  <Input
                    placeholder="Nhập tên hoặc email"
                    size="lg"
                    variant="outline"
                    value={search} // Liên kết với state search
                    onChange={handleSearch} // Gọi handleSearch mỗi khi người dùng nhập
                    w="115%"
                  />
                </Box>
              </Drawer.Header>
              <Drawer.Body>
                <Box mt={3}>
                  {loading ? (
                    <ChatLoading />
                  ) : (
                    search &&
                    searchResult?.map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => accessChat(user._id)}
                      />
                    ))
                  )}
                </Box>
              </Drawer.Body>
              <Drawer.Footer>
                {/* <Button variant="outline">Cancel</Button>
                <Button>Save</Button> */}
                {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default SearchDrawer;
