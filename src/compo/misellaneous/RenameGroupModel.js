import React, { useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Field,
  Input,
  VStack,
  Fieldset,
} from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import socket from "../../context/socket";

const RenameGroupModel = ({ isOpen, onClose, fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [name, setName] = useState(selectedChat.chatName);
  const [loading, setLoading] = useState(false);

  const handleRename = async () => {
    if (!name) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: name,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      socket.emit("group:updated", data);
      toaster.create({
        title: "Đổi tên nhóm thành công",
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
    setName("");
  };
  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={onClose} size={"xs"}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header borderBottom="1px solid" borderColor="gray.200">
                <Dialog.Title>Đổi tên nhóm</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4">
                <VStack gap="5px">
                  <Fieldset.Root size="lg" maxW="md">
                    <Fieldset.Content>
                      <Field.Root required>
                        <p>
                          Bạn có chắc chắn muốn đổi tên nhóm, khi xác nhận tên
                          nhóm mới sẽ hiên thị với tất cả thành viên.
                        </p>
                        <Input
                          name="name"
                          placeholder="Nhập tên nhóm mới..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Field.Root>
                    </Fieldset.Content>
                  </Fieldset.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Hủy bỏ</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="blue"
                  onClick={handleRename}
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

export default RenameGroupModel;
