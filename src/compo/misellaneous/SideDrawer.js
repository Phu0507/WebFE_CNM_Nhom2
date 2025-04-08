import { Box, Button, Menu, Text, Avatar, Portal } from "@chakra-ui/react";
import { Tooltip } from "../../components/ui/tooltip";
import React, { useState } from "react";
import {
  FaBell,
  FaAngleDown,
  FaUser,
  FaSignOutAlt,
  FaLock,
} from "react-icons/fa";
import { ChatState } from "../../context/ChatProvider";
import ProfileModel from "./ProfileModel";
import LogoutHandler from "./LogoutHandler";
import SearchDrawer from "./SearchDrawer";
import ChangePassword from "./ChangePassword";
import { ColorModeButton } from "../../components/ui/color-mode";

const SideDrawer = () => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isLogoutOpen, setLogoutOpen] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);

  const { user } = ChatState();

  return (
    <>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems="center"
        bg={"white"}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip
          content="Search Users to chat"
          openDelay={300}
          closeDelay={100}
        >
          <SearchDrawer />
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Poppins" color="#0088FF">
          Zalo
        </Text>
        <div>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="ghost" p={0}>
                <FaBell />
              </Button>
            </Menu.Trigger>
          </Menu.Root>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline" p={1}>
                <Avatar.Root size={"sm"}>
                  <Avatar.Fallback name={user.fullName} />
                  <Avatar.Image src="https://bit.ly/broken-link" />
                </Avatar.Root>
                <FaAngleDown />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item
                    value="my-profile"
                    cursor={"pointer"}
                    onClick={() => setProfileOpen(true)}
                  >
                    Hồ sơ cá nhân
                    <Menu.ItemCommand>
                      <FaUser />
                    </Menu.ItemCommand>
                  </Menu.Item>

                  <Menu.Separator />
                  <Menu.Item
                    value="change-password"
                    cursor={"pointer"}
                    onClick={() => setChangePasswordOpen(true)}
                  >
                    Đổi mật khẩu
                    <Menu.ItemCommand>
                      <FaLock />
                    </Menu.ItemCommand>
                  </Menu.Item>

                  <Menu.Separator />
                  <Menu.Item
                    value="logout"
                    cursor={"pointer"}
                    onClick={() => setLogoutOpen(true)}
                  >
                    Đăng xuất
                    <Menu.ItemCommand>
                      <FaSignOutAlt />
                    </Menu.ItemCommand>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>
      </Box>

      {isProfileOpen && (
        <ProfileModel
          isOpen={isProfileOpen}
          onClose={() => setProfileOpen(false)}
          user={user}
        />
      )}

      {isLogoutOpen && (
        <LogoutHandler
          isOpen={isLogoutOpen}
          onClose={() => setLogoutOpen(false)}
        />
      )}
      {isChangePasswordOpen && (
        <ChangePassword
          isOpen={isChangePasswordOpen}
          onClose={() => setChangePasswordOpen(false)}
        />
      )}
    </>
  );
};

export default SideDrawer;
