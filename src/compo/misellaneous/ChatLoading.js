import { HStack, SkeletonText, SkeletonCircle, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack gap="10" maxW="xs">
      <HStack width="full">
        <SkeletonCircle size="12" />
        <SkeletonText noOfLines={2} />
      </HStack>

      <HStack width="full">
        <SkeletonCircle size="12" />
        <SkeletonText noOfLines={2} />
      </HStack>

      <HStack width="full">
        <SkeletonCircle size="12" />
        <SkeletonText noOfLines={2} />
      </HStack>

      <HStack width="full">
        <SkeletonCircle size="12" />
        <SkeletonText noOfLines={2} />
      </HStack>
    </Stack>
  );
};

export default ChatLoading;
