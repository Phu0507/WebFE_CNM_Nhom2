import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  CloseButton,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { RiUserAddLine } from "react-icons/ri";
import { Tooltip } from "../../components/ui/tooltip";
import { ChatState } from "../../context/ChatProvider";
import { toaster } from "../../components/ui/toaster";
import UserList from "../userAvatar/UserList";
import ChatLoading from "./ChatLoading";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import socket from "../../context/socket";

const AddUserModal = ({ fetchAgain, setFetchAgain }) => {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const resetForm = () => {
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
    setLoading(false);
  };

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
    setLoadingButton(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: selectedUsers.map((u) => u._id),
        },
        config
      );
      resetForm();
      setOpen(false);
      socket.emit("group:updated", data);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toaster.create({
        title: "Thêm thành công",
        type: "success",
      });
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Không thêm được!",
        type: "error",
      });
    } finally {
      setLoadingButton(false);
    }
  };

  const handleGroup = (userClick) => {
    const alreadySelected = selectedUsers.some((u) => u._id === userClick._id);

    if (alreadySelected) {
      // Nếu đã chọn thì bỏ chọn
      setSelectedUsers(selectedUsers.filter((u) => u._id !== userClick._id));
    } else {
      // Nếu chưa chọn thì thêm vào danh sách
      setSelectedUsers([...selectedUsers, userClick]);
    }
  };

  const handleDelete = (userDel) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userDel._id));
  };

  return (
    <Dialog.Root
      size="md"
      open={open}
      onOpenChange={(e) => {
        setOpen(e.open);
        if (!e.open) resetForm();
      }}
    >
      <Tooltip content="Thêm thành viên" openDelay={300} closeDelay={100}>
        <Dialog.Trigger asChild>
          <Button variant="ghost" size="xs" gap="0">
            <RiUserAddLine />
          </Button>
        </Dialog.Trigger>
      </Tooltip>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header borderBottom="1px solid" borderColor="gray.200">
              <Dialog.Title>Thêm thành viên </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <Stack gap="4">
                <Field.Root>
                  <Input
                    placeholder="Nhập tên hoặc email"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </Field.Root>
              </Stack>
              {(selectedUsers.length > 0 || searchResult.length > 0) && (
                <Box display="flex" gap="1" mt="2">
                  {/* Box 2 - Search Results */}
                  <Box flex="1" maxHeight="340px" overflowY="auto">
                    {loading ? (
                      <ChatLoading />
                    ) : (
                      searchResult?.map((user) => (
                        <UserList
                          key={user._id}
                          user={user}
                          isSelected={selectedUsers.some(
                            (u) => u._id === user._id
                          )}
                          handleToggle={handleGroup}
                          existingMembers={selectedChat?.users}
                        />
                      ))
                    )}
                  </Box>

                  {/* Box 1 - Selected Users */}
                  {selectedUsers.length > 0 && (
                    <Box
                      flex="1"
                      maxWidth={"160px"}
                      overflowY="auto"
                      p="1"
                      border="1px solid lightgray"
                      borderRadius="md"
                    >
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
                disabled={selectedUsers.length < 1}
                loading={loadingButton}
              >
                Xác nhận
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
export default AddUserModal;
