import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toaster } from "../../components/ui/toaster";
import { Button, HStack, Field, VStack, Fieldset } from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};

  useEffect(() => {
    const otpVerified = localStorage.getItem("otpVerified");
    if (!otpVerified || otpVerified !== "true" || !email || !otp) {
      navigate("/");
    }

    return () => {
      localStorage.removeItem("otpVerified"); // xóa sau khi vào
    };
  }, [navigate, email, otp]);

  const submitHandler = async () => {
    if (!newPassword || !confirmNewPassword) {
      toaster.create({
        title: "Vui lòng nhập đầy đủ thông tin",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 8) {
      toaster.create({
        title: "Mật khẩu phải có ít nhất 8 ký tự",
        type: "error",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toaster.create({
        title: "Mật khẩu nhập lại không khớp",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/users/reset-password-forgot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đặt lại mật khẩu thất bại");
      }

      toaster.create({
        title: data.message || "Đặt lại mật khẩu thành công",
        type: "success",
      });

      navigate("/");
    } catch (err) {
      toaster.create({
        title: "Đã xảy ra lỗi",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack gap="5px">
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Content>
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
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </Field.Root>
        </Fieldset.Content>
        <HStack justify="space-between">
          <Button
            type="submit"
            alignSelf="flex-start"
            colorPalette={"blue"}
            onClick={submitHandler}
            loading={loading}
            loadingText="Đang gửi..."
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
            _loading={{ bg: "blue.600" }}
          >
            Tiếp tục
          </Button>
        </HStack>
      </Fieldset.Root>
    </VStack>
  );
};

export default ResetPassword;
