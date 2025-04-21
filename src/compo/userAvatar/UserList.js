import React from "react";
import { Box, Avatar, Text, Flex, Badge } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

const UserList = ({ user, isSelected, handleToggle, existingMembers = [] }) => {
  const isInGroup = existingMembers.some((u) => u._id === user._id);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      py="2"
      borderRadius="md"
      cursor={isInGroup ? "not-allowed" : "pointer"}
      _hover={{ bg: isInGroup ? "transparent" : "gray.100" }}
      onClick={() => {
        if (!isInGroup) handleToggle(user);
      }}
      opacity={isInGroup ? 0.6 : 1}
    >
      <Flex align="center">
        <Box
          w="17px"
          h="17px"
          borderRadius="full"
          border="2px solid #ccc"
          bg={isSelected || isInGroup ? "blue.600" : "transparent"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr="2"
        >
          {(isSelected || isInGroup) && <FaCheck color="white" size="10px" />}
        </Box>
        <Avatar.Root size="lg" cursor="pointer">
          <Avatar.Fallback name={user.fullName} />
          <Avatar.Image src={user.avatar} />
        </Avatar.Root>
        <Box px={2} flexGrow={1}>
          <Text fontWeight="semibold" fontSize="sm">
            {user.fullName}
          </Text>
          {/* Ghi chú "Đã tham gia" nếu đã là thành viên */}
          {isInGroup && (
            <Badge colorPalette="green" fontSize="xs" mt="1">
              Đã tham gia
            </Badge>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default UserList;
