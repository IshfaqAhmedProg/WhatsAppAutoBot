import { Heading } from "@chakra-ui/react";
import React from "react";

export default function PageTitle({ children }) {
  return (
    <Heading
      color="gray.700"
      position="absolute"
      left="50%"
      top="10%"
      transform="translate(-50%,-10%)"
    >
      {children}
    </Heading>
  );
}
