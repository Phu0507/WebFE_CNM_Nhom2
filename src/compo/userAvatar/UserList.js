import React from "react";
import { Box, Avatar, Text, Flex } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

const UserList = ({ user, isSelected, handleToggle }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      py="2"
      borderRadius="md"
      cursor="pointer"
      _hover={{ bg: "gray.100" }}
      onClick={() => handleToggle(user)}
    >
      <Flex align="center">
        <Box
          w="17px"
          h="17px"
          borderRadius="full"
          border="2px solid #ccc"
          bg={isSelected ? "blue.600" : "transparent"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr="2"
        >
          {isSelected && <FaCheck color="white" size="10px" />}
        </Box>
        <Avatar.Root size="lg" cursor="pointer">
          <Avatar.Fallback name={user.fullName} />
          <Avatar.Image src={user.avatar} />
        </Avatar.Root>
        <Box px={2} flexGrow={1}>
          <Text fontWeight="semibold" fontSize="sm">
            {user.fullName}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserList;
