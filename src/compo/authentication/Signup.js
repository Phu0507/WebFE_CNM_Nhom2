import React, { useState } from "react";
import { HStack, VStack } from "@chakra-ui/react";
import {
  Button,
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
  Stack,
} from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";
import { toaster } from "../../components/ui/toaster";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toaster.create({
        title: "Please fill all the fields",
        type: "error",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toaster.create({
        title: "Passwords do not match",
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
        "/api/user",
        { name, email, password },
        config
      );
      toaster.create({
        title: "User created successfully",
        type: "success",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      // history.pushState("/chat");
    } catch (err) {
      toaster.create({
        title: err.response.data.message,
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
              Name
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="name"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Email address
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Password
              <Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Confirm Password
              <Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm Password"
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
          Sign Up
        </Button>
      </Fieldset.Root>
    </VStack>
  );
};

export default Signup;
