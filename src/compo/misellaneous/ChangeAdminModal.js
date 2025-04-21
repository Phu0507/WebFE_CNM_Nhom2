import React, { useState, useEffect } from "react";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { toaster } from "../../components/ui/toaster";
import socket from "../../context/socket";
const ChangeAdminModal = ({
  isOpen,
  onClose,
  userToChange,
  fetchAgain,
  setFetchAgain,
}) => {
  const { user, setChats, selectedChat, setSelectedChat } = ChatState();
  const [loading, setLoading] = useState(false);
  const handleChange = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/transferAdmin/${selectedChat._id}`, // <-- chatId đưa lên URL
        {
          newAdminId: userToChange._id, // <-- chỉ còn userId trong body
        },
        config
      );

      // setSelectedChat(data);
      // setFetchAgain(!fetchAgain);
      setLoading(false);
      toaster.create({
        title: "Chuyển quyền thành công",
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

  // useEffect(() => {
  //   socket.emit("setup", user._id);

  //   socket.on("admin:transferred", ({ chatId, newAdminId }) => {
  //     setChats((prevChats) =>
  //       prevChats.map((chat) =>
  //         chat._id === chatId
  //           ? { ...chat, groupAdmin: { _id: newAdminId } }
  //           : chat
  //       )
  //     );
  //     if (selectedChat?._id === chatId) {
  //       setSelectedChat((prev) => ({
  //         ...prev,
  //         groupAdmin: { _id: newAdminId },
  //       }));
  //     }
  //   });

  //   return () => {
  //     socket.off("admin:transferred");
  //   };
  // }, [user, selectedChat, setChats, setSelectedChat]);

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
                  Bạn chắc chắn chuyển quyền trường nhóm cho{" "}
                  {userToChange.fullName}?
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Hủy bỏ</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={handleChange}
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

export default ChangeAdminModal;
