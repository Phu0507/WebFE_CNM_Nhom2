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
import { PasswordInput } from "../../components/ui/password-input";
import { toaster } from "../../components/ui/toaster";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();
  const [loading, setLoading] = useState(false);

  const { user } = ChatState();

  const handleChangePassword = async () => {
    setLoading(true);
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toaster.create({
        title: "Vui lòng điền đầy đủ thông tin",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toaster.create({
        title: "Mật khẩu mới không khớp",
        type: "error",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/users/update-password",
        { oldPassword, newPassword },
        config
      );
      toaster.create({
        title: "Đổi mật khẩu thành công",
        type: "success",
      });
      setLoading(false);
      onClose();
    } catch (err) {
      toaster.create({
        title: err.response?.data?.message || "Mật khẩu cũ không chính xác",
        type: "error",
      });
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={onClose} size={"xs"}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header borderBottom="1px solid" borderColor="gray.200">
                <Dialog.Title>Đổi mật khẩu</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4">
                <VStack gap="5px">
                  <Fieldset.Root size="lg" maxW="md">
                    <Fieldset.Content>
                      <Field.Root required>
                        <Field.Label>
                          Mật khẩu cũ
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <PasswordInput
                          name="oldPassword"
                          placeholder="Nhập mật khẩu cũ"
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                      </Field.Root>

                      <Field.Root required>
                        <Field.Label>
                          Mật khẩu mới
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <PasswordInput
                          name="newPassword"
                          placeholder="Nhập mật khẩu mới"
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </Field.Root>

                      <Field.Root required>
                        <Field.Label>
                          Nhập lại mật khẩu mới
                          <Field.RequiredIndicator />
                        </Field.Label>
                        <PasswordInput
                          name="confirmNewPassword"
                          placeholder="Nhập lại mật khẩu mới"
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
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
                  onClick={handleChangePassword}
                  loading={loading}
                >
                  Đổi mật khẩu
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

export default ChangePassword;
