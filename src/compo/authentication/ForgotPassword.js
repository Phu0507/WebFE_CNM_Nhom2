import React from "react";
import { Field, Button, Group, Input } from "@chakra-ui/react";

const forgotPassword = () => {
  return (
    <Group attached w="full">
      <Input flex="1" placeholder="Nhập địa chỉ email của bạn" />
      <Button
        bg="bg.subtle"
        variant="outline"
        _hover={{ backgroundColor: "blue.500", color: "white" }}
      >
        Tiếp tục
      </Button>
    </Group>
  );
};

export default forgotPassword;
