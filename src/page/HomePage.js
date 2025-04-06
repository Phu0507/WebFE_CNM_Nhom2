import React from "react";
import { useState, useEffect } from "react";
import { Box, Container, Text, Tabs } from "@chakra-ui/react";
import Signin from "../compo/authentication/Signin";
import Signup from "../compo/authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [value, setValue] = useState("first");
  const navigate = useNavigate(); // Sử dụng useNavigate thay vì useHistory

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats"); // Dùng navigate thay vì history.push
    }
  }, [navigate]); // Dùng navigate thay vì history

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
        <Tabs.Root
          value={value}
          onValueChange={(e) => setValue(e.value)}
          fitted
          variant="subtle"
        >
          <Tabs.List>
            <Tabs.Trigger value="first">Đăng nhập</Tabs.Trigger>
            <Tabs.Trigger value="second">Đăng ký</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="first">
            <Signin />
          </Tabs.Content>
          <Tabs.Content value="second">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default HomePage;
