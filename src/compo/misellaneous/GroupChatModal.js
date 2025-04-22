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
import {
  RiUserLine,
  RiGroupLine,
  RiAddLine,
  RiUserAddLine,
} from "react-icons/ri";
import { Tooltip } from "../../components/ui/tooltip";
import { ChatState } from "../../context/ChatProvider";
import { toaster } from "../../components/ui/toaster";
import UserList from "../userAvatar/UserList";
import ChatLoading from "./ChatLoading";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import socket from "../../context/socket";

const GroupChatModal = () => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const { user, setSelectedChat } = ChatState();

  const resetForm = () => {
    setGroupChatName("");
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
    if (groupChatName !== groupChatName.trim()) {
      toaster.create({
        title: "Tên nhóm không bắt đầu hoặc kết thúc bằng khoảng trống",
        type: "error",
      });
      return;
    }
    setLoadingButton(true);
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
      socket.emit("group:new", data);
      resetForm();
      setOpen(false);
      setSelectedChat(data);
      toaster.create({
        title: "Tạo nhóm thành công",
        type: "success",
      });
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Không tạo được nhóm!",
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
      <Tooltip content="Tạo nhóm chat" openDelay={300} closeDelay={100}>
        <Dialog.Trigger asChild>
          <Button variant="ghost" size="xs" gap="0">
            <RiGroupLine />
            <RiAddLine />
          </Button>
        </Dialog.Trigger>
      </Tooltip>
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
                disabled={!groupChatName || selectedUsers.length < 2}
                loading={loadingButton}
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
