import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  CloseButton,
  Toast,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import {
  RiUserLine,
  RiGroupLine,
  RiAddLine,
  RiUserAddLine,
} from "react-icons/ri";
import { ChatState } from "../../context/ChatProvider";
import { toaster } from "../../components/ui/toaster";
import UserListItem from "../userAvatar/UserListItem";
import ChatLoading from "./ChatLoading";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = () => {
  const [open, setOpen] = useState(false);
  const resetForm = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
    setLoading(false);
  };

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Có lỗi xảy ra!",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toaster.create({
        title: "Vui lòng nhập tên nhóm và chọn người dùng",
        type: "error",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      resetForm();
      setOpen(false);
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Không tạo được nhóm!",
        type: "error",
      });
    }
  };
  const handleGroup = (userAdd) => {
    if (selectedUsers.includes(userAdd)) {
      toaster.create({
        title: "Người dùng đã có trong danh sách",
        type: "error",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userAdd]);
  };

  const handleDelete = (userDel) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userDel._id));
  };

  return (
    <Dialog.Root
      size="lg"
      open={open}
      onOpenChange={(e) => {
        setOpen(e.open);
        if (!e.open) resetForm();
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="xs" gap="0">
          <RiGroupLine />
          <RiAddLine />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header borderBottom="1px solid" borderColor="gray.200">
              <Dialog.Title>Tạo nhóm</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <Stack gap="4">
                <Field.Root>
                  <Input
                    placeholder="Nhập tên nhóm"
                    variant="flushed"
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                </Field.Root>
                <Field.Root>
                  <Input
                    placeholder="Nhập tên hoặc email"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </Field.Root>
              </Stack>
              {(selectedUsers.length > 0 || searchResult.length > 0) && (
                <Box display="flex" gap="4" mt="4">
                  {/* Box 2 - Search Results */}
                  <Box
                    flex="1"
                    maxHeight="350px"
                    overflowY="auto"
                    border="1px solid lightgray"
                    borderRadius="md"
                    p="2"
                  >
                    {loading ? (
                      <ChatLoading />
                    ) : (
                      searchResult?.map((user) => (
                        <UserListItem
                          key={user._id}
                          user={user}
                          handleFunction={() => handleGroup(user)}
                        />
                      ))
                    )}
                  </Box>

                  {/* Box 1 - Selected Users */}
                  {selectedUsers.length > 0 && (
                    <Box flex="1" maxWidth={"200px"} overflowY="auto" p="2">
                      {selectedUsers.map((user) => (
                        <UserBadgeItem
                          key={user._id}
                          user={user}
                          handleFunction={() => handleDelete(user)}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Dialog.Body>
            <Dialog.Footer borderTop="1px solid" borderColor="gray.200">
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Hủy</Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette={"blue"}
                onClick={handleSubmit}
                disabled={!groupChatName || selectedUsers.length === 0}
              >
                Tạo nhóm
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default GroupChatModal;
