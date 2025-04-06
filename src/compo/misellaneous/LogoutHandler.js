import React from "react";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Thay thế useHistory bằng useNavigate

const LogoutHandler = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // Sử dụng useNavigate thay vì useHistory
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/"); // Dùng navigate thay vì history.push
  };

  return (
    <>
      <Dialog.Root
        role="alertdialog"
        open={isOpen}
        onOpenChange={onClose}
        size={"xs"}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header borderBottom="1px solid" borderColor="gray.200">
                <Dialog.Title>Xác nhận</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>Bạn chắc chắn muốn đăng xuất khỏi tài khoản của mình?</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Hủy bỏ</Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="red" onClick={handleLogout}>
                  Đăng xuất
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

export default LogoutHandler;
