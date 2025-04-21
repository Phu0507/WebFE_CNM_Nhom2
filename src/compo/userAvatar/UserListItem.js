import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor={"pointer"}
      bg="#F0F0F0"
      _hover={{ background: "#38B2AC", color: "white" }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={3}
      borderRadius="lg"
    >
      <Avatar.Root size="xl" cursor="pointer">
        <Avatar.Fallback name={user.fullName} />
        <Avatar.Image src={user.avatar} />
      </Avatar.Root>
      <Box px={3} flexGrow={1}>
        <Text fontWeight="semibold" fontSize="sm">
          {user.fullName}
        </Text>
        {/* <Text fontSize="xs">{user.email}</Text> */}
      </Box>
    </Box>
  );
};

export default UserListItem;
