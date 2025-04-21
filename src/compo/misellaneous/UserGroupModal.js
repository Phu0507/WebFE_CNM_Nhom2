import React, { useState } from "react";
import { Box, Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import UserGroupItem from "../userAvatar/UserGroupItem";
const UserGroupModal = ({ isOpen, onClose, fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = ChatState();

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={onClose} size={"xs"}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header borderBottom="1px solid" borderColor="gray.200">
                <Dialog.Title>Thành viên nhóm</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4" px="2">
                <Box flex="1" maxHeight="400px" overflowY="auto" width="100%">
                  {[...selectedChat?.users]
                    ?.sort((a, b) => {
                      if (a._id === selectedChat.groupAdmin?._id) return -1;
                      if (b._id === selectedChat.groupAdmin?._id) return 1;
                      return 0;
                    })
                    .map((users) => (
                      <UserGroupItem
                        key={user._id}
                        user={users}
                        groupAdmin={selectedChat.groupAdmin}
                        currentUser={user}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                      />
                    ))}
                </Box>
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Thoát</Button>
                </Dialog.ActionTrigger>
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

export default UserGroupModal;
