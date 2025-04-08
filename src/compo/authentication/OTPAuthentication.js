import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, VStack, Text } from "@chakra-ui/react";
import OTPInput from "react18-otp-input";
import { toaster } from "../../components/ui/toaster";

const OTPAuthentication = () => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const otpAccess = localStorage.getItem("otpAccess");
    if (!otpAccess || otpAccess !== "true" || !location.state?.email) {
      navigate("/");
    }

    return () => {
      localStorage.removeItem("otpAccess");
    };
  }, [navigate, location.state]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (!canResend) return;

    const email = location.state?.email;
    if (!email) {
      toaster.create({
        title: "Không tìm thấy địa chỉ email",
        type: "error",
      });
      return;
    }

    console.log("Gửi lại mã OTP cho:", email);

    try {
      const response = await fetch("http://localhost:5000/users/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gửi lại OTP thất bại");
      }

      localStorage.setItem("otpAccess", "true");

      toaster.create({
        title: data.message || "Mã xác thực đã được gửi lại",
        type: "info",
      });

      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Lỗi khi gửi lại mã OTP",
        type: "error",
      });
    }
  };

  const handleContinue = async () => {
    if (otp.length !== 6) return;

    try {
      const response = await fetch("http://localhost:5000/users/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: location.state.email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Xác thực OTP thất bại");
      }
      toaster.create({
        title: data.message || "Xác thực OTP thành công",
        type: "success",
      });

      localStorage.setItem("otpVerified", "true");
      navigate("/resetpassword", {
        state: {
          email: location.state.email,
          otp,
        },
      });
    } catch (err) {
      toaster.create({
        title: "Mã OTP không chính xác",
        type: "error",
      });
    }
  };

  return (
    <VStack spacing={4}>
      <OTPInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        inputStyle={{
          width: "48px",
          height: "48px",
          fontSize: "24px",
          border: "1px solid gray",
          borderRadius: "8px",
          marginRight: "8px",
        }}
      />

      <Button
        backgroundColor="blue.500"
        color="white"
        onClick={handleContinue}
        disabled={otp.length !== 6}
        variant="outline"
      >
        Tiếp tục
      </Button>

      <Text color="gray.600">
        {canResend ? (
          <Button
            size="sm"
            onClick={handleResend}
            variant="link"
            colorScheme="blue"
          >
            Gửi lại mã
          </Button>
        ) : (
          <>Gửi lại mã sau {countdown}s</>
        )}
      </Text>
    </VStack>
  );
};

export default OTPAuthentication;
