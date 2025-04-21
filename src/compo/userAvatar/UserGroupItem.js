import React, { useState } from "react";
import { Avatar, Box, Text, Badge, Button, Menu } from "@chakra-ui/react";
import { RiMoreFill, RiLogoutBoxRLine, RiRepeatLine } from "react-icons/ri";
import DeleteUserModal from "../misellaneous/DeleteUserModal";
import ChangeAdminModal from "../misellaneous/ChangeAdminModal";
const UserGroupItem = ({
  user,
  groupAdmin,
  currentUser,
  fetchAgain,
  setFetchAgain,
}) => {
  const isGroupAdmin = currentUser._id === groupAdmin?._id;
  const isAdmin = user._id === groupAdmin?._id;
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isChangeOpen, setChangeOpen] = useState(false);

  return (
    <>
      <Box
        cursor={"pointer"}
        _hover={{ background: "#F0F0F0" }}
        w="100%"
        display="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={1}
        flexDir="row"
      >
        <Avatar.Root size="xl" cursor="pointer">
          <Avatar.Fallback name={user.fullName} />
          <Avatar.Image src={user.avatar} />
        </Avatar.Root>
        <Box px={3} flexGrow={1}>
          <Text fontWeight="semibold" fontSize="sm">
            {user._id === currentUser._id ? "Bạn" : user.fullName}
          </Text>
          {isAdmin && <Badge colorPalette="green">Trưởng nhóm</Badge>}
        </Box>
        {/* Nếu currentUser là groupAdmin thì hiện button cho tất cả thành viên */}
        {isGroupAdmin && user._id !== currentUser._id && (
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="subtle" p={1} size={"xs"}>
                <RiMoreFill />
              </Button>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item
                  value="change"
                  cursor="pointer"
                  onClick={() => setChangeOpen(true)}
                >
                  Chuyển quyền
                  <Menu.ItemCommand>
                    <RiRepeatLine />
                  </Menu.ItemCommand>
                </Menu.Item>

                <Menu.Separator />
                <Menu.Item
                  value="kick"
                  cursor="pointer"
                  onClick={() => setDeleteOpen(true)}
                >
                  Mời khỏi nhóm
                  <Menu.ItemCommand>
                    <RiLogoutBoxRLine />
                  </Menu.ItemCommand>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        )}
      </Box>
      {isDeleteOpen && (
        <DeleteUserModal
          isOpen={isDeleteOpen}
          onClose={() => setDeleteOpen(false)}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          userToDelete={user}
        />
      )}

      {isChangeOpen && (
        <ChangeAdminModal
          isOpen={isChangeOpen}
          onClose={() => setChangeOpen(false)}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          userToChange={user}
        />
      )}
    </>
  );
};

export default UserGroupItem;
