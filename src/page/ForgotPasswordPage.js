import React from "react";
import { useState, useEffect } from "react";
import { Box, Container, Text, Tabs } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../compo/authentication/ForgotPassword";

const ForgotPasswordPage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="5xl" fontFamily="Poppins" color="#0088FF">
          Zalo
        </Text>
      </Box>
      <Box
        p={4}
        bg={"white"}
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
        color={"black"}
      >
        <Tabs.Root fitted variant="subtle" value={"first"}>
          <Tabs.List>
            <Tabs.Trigger value="first">Quên mật khẩu</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="first">
            <ForgotPassword />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
