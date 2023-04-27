import React, { useEffect } from "react";
import { Alert, AlertIcon, CloseButton, useDisclosure } from "@chakra-ui/react";
export default function AlertComponent({ message }) {
  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: true });
  useEffect(() => {
    const closer = setTimeout(() => {
      if (isVisible) {
        onClose();
      }
    }, 1000);
    return () => {
      clearTimeout(closer);
    };
  });

  return (
    isVisible && (
      <Alert
        status="info"
        position="absolute"
        left="50%"
        top="-20%"
        transform="translate(-50%,0)"
        colorScheme="whatsapp"
        color="whatsapp.500"
        borderRadius="md"
      >
        <AlertIcon />
        {message}
      </Alert>
    )
  );
}
