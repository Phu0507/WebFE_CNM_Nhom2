import React, { useState } from "react";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { toaster } from "../../components/ui/toaster";
import socket from "../../context/socket";
const DeleteUserModal = ({
  isOpen,
  onClose,
  userToDelete,
  fetchAgain,
  setFetchAgain,
}) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [loading, setLoading] = useState(false);
  const handleRemove = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToDelete._id,
        },
        config
      );
      socket.emit("group:updated", data);
      if (userToDelete._id === user._id) {
        setSelectedChat();
      } else {
        setSelectedChat(data);
      }
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toaster.create({
        title:
          userToDelete._id === user._id
            ? "Rời nhóm thành công"
            : `Đã mời ${userToDelete.fullName} khỏi nhóm`,
        type: "success",
      });

      onClose();
    } catch (error) {
      toaster.create({
        title: error.response?.data?.message || "Có lỗi",
        type: "error",
      });
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog.Root
        role="alertdialog"
        open={isOpen}
        onOpenChange={onClose}
        size={"md"}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header borderBottom="1px solid" borderColor="gray.200">
                <Dialog.Title>Xác nhận</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>
                  {userToDelete?._id === user._id
                    ? "Bạn chắc chắn muốn rời khỏi nhóm?"
                    : `Bạn chắc chắn muốn mời ${userToDelete?.fullName} khỏi nhóm?`}
                </p>
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Hủy bỏ</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={handleRemove}
                  loading={loading}
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
    </>
  );
};

export default DeleteUserModal;
