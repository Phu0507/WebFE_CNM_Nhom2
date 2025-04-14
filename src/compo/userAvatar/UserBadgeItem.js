import { Avatar, Box, Text, HStack, Flex } from "@chakra-ui/react";
import React from "react";
import { FaTimesCircle } from "react-icons/fa";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="full"
      m={1}
      mb={2}
      fontSize={12}
      backgroundColor="#66B2FF"
      color="gray.800"
      display={"flex"}
      justifyContent="space-between"
      alignItems="center"
    >
      <HStack>
        <Avatar.Root size="2xs">
          <Avatar.Fallback name={user.fullName} />
          <Avatar.Image src={user.avatar} />
        </Avatar.Root>
        <Text maxW="70px" truncate>
          {user.fullName}
        </Text>
      </HStack>
      <FaTimesCircle
        size={16}
        color="#E60000"
        onClick={handleFunction}
        cursor={"pointer"}
      />
    </Box>
  );
};

export default UserBadgeItem;
