import React, { useState } from "react";
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
import { FaExclamationCircle } from "react-icons/fa";
import { RiCameraLine } from "react-icons/ri";

const ProfileModel = ({ isOpen, onClose, user }) => {
  const [isEdit, setIsEdit] = React.useState(false);
  return (
    <VStack alignItems="start">
      <Dialog.Root open={isOpen} onOpenChange={onClose} size={"xs"}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header borderBottom="1px solid" borderColor="gray.200">
                <Dialog.Title>
                  {isEdit ? "Cập nhật" : "Thông tin tài khoản"}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="8" pt="4">
                <DataList.Root orientation="horizontal">
                  <DataList.Item>
                    <DataList.ItemValue>
                      <HStack>
                        <HStack position="relative">
                          <Avatar.Root size="2xl" cursor="pointer">
                            <Avatar.Image src={user.avatar} />
                            <Avatar.Fallback name={user.fullName} />
                          </Avatar.Root>
                          {/* Nút máy ảnh nằm ở góc phải dưới avatar */}
                          <label htmlFor="avatar-upload">
                            <Button
                              as="span"
                              position="absolute"
                              bottom={0}
                              right={0}
                              size="xs"
                              p="1"
                              borderRadius="full"
                              variant={"surface"}
                            >
                              <RiCameraLine />
                            </Button>
                          </label>
                          {/* Input ẩn */}
                          <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                // 👉 TODO: Gửi file này lên server để cập nhật avatar
                                console.log("Ảnh mới:", file);
                              }
                            }}
                          />
                        </HStack>

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
                    <DataList.ItemLabel>Giới tính</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {user.gender === "male"
                        ? "Nam"
                        : user.gender === "female"
                        ? "Nữ"
                        : "Khác"}
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Ngày sinh</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Email</DataList.ItemLabel>
                    <DataList.ItemValue>{user.email}</DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Số điện thoại</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {user.phoneNumber || (
                        <span style={{ color: "red" }}>
                          <HStack>
                            Chưa cập nhật
                            <FaExclamationCircle />
                          </HStack>
                        </span>
                      )}
                    </DataList.ItemValue>
                  </DataList.Item>
                </DataList.Root>
              </Dialog.Body>
              <Dialog.Footer
                borderTop="1px solid"
                borderColor="gray.200"
                justifyContent="center"
              >
                <Button
                  variant="surface"
                  onClick={() => setIsEdit((prev) => !prev)}
                >
                  {isEdit ? "Huỷ" : "Chỉnh sửa"}
                </Button>
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
