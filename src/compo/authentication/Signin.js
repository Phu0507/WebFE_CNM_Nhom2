import React, { useState } from "react";
import { HStack, VStack } from "@chakra-ui/react";
import { Button, Field, Fieldset, Input, Link } from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";
import { toaster } from "../../components/ui/toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toaster.create({
        title: "Please fill all the fields",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/users/signin",
        { email, password },
        config
      );
      toaster.create({
        title: "User logged in successfully",
        type: "success",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
      window.location.reload();
    } catch (err) {
      toaster.create({
        title: err.response?.data?.error || "Có lỗi xảy ra!",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <VStack gap="5px">
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Content>
          <Field.Root required>
            <Field.Label>
              Địa chỉ email
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="email"
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Mật khẩu
              <Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
              name="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          >
            Đăng nhập
          </Button>
          <Link
            color="blue.500"
            fontSize="sm"
            onClick={() => navigate("/forgotpassword")}
          >
            Quên mật khẩu?
          </Link>
        </HStack>
      </Fieldset.Root>
    </VStack>
  );
};

export default Signin;
