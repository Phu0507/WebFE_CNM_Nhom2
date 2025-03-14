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
  Link,
  Text,
} from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";
import { toaster } from "../../components/ui/toaster";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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
        "/api/user/signin",
        { email, password },
        config
      );
      toaster.create({
        title: "User logged in successfully",
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
              Email address
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field.Root>
        </Fieldset.Content>
        <Button
          type="submit"
          alignSelf="flex-start"
          colorPalette={"blue"}
          onClick={submitHandler}
          loading={loading}
        >
          Sign In
        </Button>
      </Fieldset.Root>
    </VStack>
  );
};

export default Signin;
