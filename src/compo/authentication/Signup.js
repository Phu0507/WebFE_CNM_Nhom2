import React, { useState } from "react";
import { HStack, VStack } from "@chakra-ui/react";
import { Button, Field, Fieldset, Input, RadioGroup } from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";
import { toaster } from "../../components/ui/toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);

    if (/\s/.test(email) || /\s/.test(password) || /\s/.test(confirmPassword)) {
      toaster.create({
        title: "Email và mật khẩu không được chứa khoảng trắng",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !dateOfBirth ||
      !gender
    ) {
      toaster.create({
        title: "Vui lòng điền đầy đủ thông tin đi",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toaster.create({
        title: "Mật khẩu không khớp",
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
        "/users/signup",
        { fullName, email, password, dateOfBirth, gender },
        config
      );
      toaster.create({
        title: "Đăng ký thành công",
        type: "success",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
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
              Họ tên
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="name"
              placeholder="Nhập họ tên của bạn"
              onChange={(e) => setFullName(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Địa chỉ email
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="email"
              type="email"
              placeholder="Nhập địa chỉ email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field.Root>
          <HStack gap="10">
            <Field.Root required>
              <Field.Label>
                Ngày sinh
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="date"
                placeholder="Chọn ngày sinh"
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </Field.Root>

            <VStack align="flex-start" spacing="2">
              <Field.Root required>
                <Field.Label>
                  Giới tính
                  <Field.RequiredIndicator />
                </Field.Label>
              </Field.Root>
              <RadioGroup.Root
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                colorPalette="blue"
                size="sm"
              >
                <HStack gap="6">
                  <RadioGroup.Item value="male">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>Nam</RadioGroup.ItemText>
                  </RadioGroup.Item>
                  <RadioGroup.Item value="female">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>Nữ</RadioGroup.ItemText>
                  </RadioGroup.Item>
                </HStack>
              </RadioGroup.Root>
            </VStack>
          </HStack>

          <Field.Root required>
            <Field.Label>
              Mật khẩu
              <Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
              name="password"
              placeholder="Nhập mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Nhập lại mật khẩu
              <Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field.Root>
        </Fieldset.Content>

        <Button
          type="button"
          alignSelf="flex-start"
          colorPalette={"blue"}
          onClick={submitHandler}
          loading={loading}
        >
          Đăng ký
        </Button>
      </Fieldset.Root>
    </VStack>
  );
};

export default Signup;
