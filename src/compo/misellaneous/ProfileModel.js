import React from "react";
import {
  Avatar,
  Badge,
  Button,
  CloseButton,
  DataList,
  Dialog,
  HStack,
  Portal,
  VStack,
  Text,
} from "@chakra-ui/react";

const ProfileModel = ({ isOpen, onClose, user }) => {
  return (
    <VStack alignItems="start">
      <Dialog.Root open={isOpen} onOpenChange={onClose} size={"xs"}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header borderBottom="1px solid" borderColor="gray.200">
                <Dialog.Title>Thông tin tài khoản</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="8" pt="4">
                <DataList.Root orientation="horizontal">
                  <DataList.Item>
                    <DataList.ItemValue>
                      <HStack>
                        <Avatar.Root size="2xl" cursor={"pointer"}>
                          <Avatar.Image src={user.avatar} />
                          <Avatar.Fallback name={user.fullName} />
                        </Avatar.Root>
                        <VStack alignItems="flex-start">
                          <Text fontWeight="semibold" fontSize="2xl">
                            {user.fullName}
                          </Text>
                          <Badge colorPalette="green">Online</Badge>
                        </VStack>
                      </HStack>
                    </DataList.ItemValue>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.ItemLabel>Email</DataList.ItemLabel>
                    <DataList.ItemValue>{user.email}</DataList.ItemValue>
                  </DataList.Item>
                  {/* <DataList.Item>
                    <DataList.ItemLabel>So dien thoai</DataList.ItemLabel>
                    <DataList.ItemValue>096703296</DataList.ItemValue>
                  </DataList.Item> */}
                </DataList.Root>
              </Dialog.Body>
              <Dialog.Footer
                borderTop="1px solid"
                borderColor="gray.200"
                justifyContent="center"
              >
                <Dialog.ActionTrigger asChild>
                  <Button variant="surface">Cập nhật</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
};

export default ProfileModel;
