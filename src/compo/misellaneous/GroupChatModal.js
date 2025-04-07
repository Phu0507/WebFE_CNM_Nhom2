import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  CloseButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  RiUserLine,
  RiGroupLine,
  RiAddLine,
  RiUserAddLine,
} from "react-icons/ri";

const GroupChatModal = () => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog.Root>
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
                  <Input placeholder="Nhập tên nhóm" variant="flushed" />
                </Field.Root>
                <Field.Root>
                  <Input placeholder="Nhập tên hoặc email" />
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer borderTop="1px solid" borderColor="gray.200">
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Hủy</Button>
              </Dialog.ActionTrigger>
              <Button>Tạo nhóm</Button>
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
