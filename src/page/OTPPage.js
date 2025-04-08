import React from "react";
import { Box, Container, Text, Tabs } from "@chakra-ui/react";
import OTPAuthentication from "../compo/authentication/OTPAuthentication";

const OTPPage = () => {
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
            <Tabs.Trigger value="first">Xác thực OTP</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="first">
            <OTPAuthentication />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default OTPPage;
