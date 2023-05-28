import React from "react";
import { Box, Button, Tooltip } from "@chakra-ui/react";
import { FaQuestion } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function LearnMoreButton({ goto }) {
  const navigate = useNavigate();
  return (
    <Box position="absolute" right={"5%"} top={"5%"}>
      <Tooltip label="Learn more">
        <Button
          color="gray.700"
          colorScheme="blackAlpha"
          size="sm"
          onClick={() => navigate(goto)}
        >
          <FaQuestion />
        </Button>
      </Tooltip>
    </Box>
  );
}
