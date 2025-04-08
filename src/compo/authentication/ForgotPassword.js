import React, { useState } from "react";
import { Button, Group, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!email) {
      toaster.create({
        title: "Vui lòng nhập địa chỉ email",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/users/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gửi OTP thất bại");
      }

      // Lưu trạng thái cho phép vào trang OTP
      localStorage.setItem("otpAccess", "true");

      // Hiển thị thông báo từ backend
      toaster.create({
        title: data.message || "Mã xác thực đã được gửi đến email của bạn",
        type: "info",
      });

      // Điều hướng tới trang OTP
      navigate("/otp", { state: { email } });
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Email không tồn tại",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Group attached w="full">
      <Input
        flex="1"
        placeholder="Nhập địa chỉ email của bạn"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        onClick={handleContinue}
        loading={loading}
        loadingText="Đang gửi..."
        // bg="bg.subtle"
        variant="outline"
        _hover={{ backgroundColor: "blue.500", color: "white" }}
        bg={loading ? "blue.500" : "bg.subtle"}
        color={loading ? "white" : "black"}
      >
        Tiếp tục
      </Button>
    </Group>
  );
};

export default ForgotPassword;
