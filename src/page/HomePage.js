import React from "react";
import { useState } from "react";
import { Box, Container, Text, Tabs } from "@chakra-ui/react";
import Signin from "../compo/authentication/Signin";
import Signup from "../compo/authentication/Signup";

const HomePage = () => {
  const [value, setValue] = useState("first");

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
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          App Chat Web
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
            <Tabs.Trigger value="first">Sign in</Tabs.Trigger>
            <Tabs.Trigger value="second">Sign up</Tabs.Trigger>
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
