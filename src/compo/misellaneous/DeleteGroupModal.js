import React, { useState } from "react";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { toaster } from "../../components/ui/toaster";

const DeleteGroupModal = ({ isOpen, onClose, fetchAgain, setFetchAgain }) => {
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
      const { data } = await axios.delete(
        `/api/chat/dissGroup/${selectedChat._id}`,
        config
      );
      setSelectedChat(null);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toaster.create({
        title: "Giải tán nhóm thành công",
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
                  Bạn chắc chắn muốn giải tán nhóm {selectedChat?.chatName}?
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

export default DeleteGroupModal;
