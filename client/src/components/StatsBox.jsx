import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { RxSlash } from "react-icons/rx";

export default function StatsBox({ count, total, title }) {
  return (
    <Box
      position="absolute"
      top="5%"
      right="5%"
      fontSize="xs"
      color="whiteAlpha.500"
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      zIndex="modal"
      bg="blackAlpha.400"
      borderRadius="md"
      padding="3"
    >
      <Box display="flex">
        <Text color="whatsapp.500" fontWeight="bold">
          {count}
        </Text>
        <RxSlash fontSize="18px" />
        <Text color="whiteAlpha.600" fontWeight="bold">
          {total}
        </Text>
      </Box>
      <Text>{title}</Text>
    </Box>
  );
}
