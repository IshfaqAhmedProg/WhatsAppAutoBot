import { Box, Button, Heading, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { FaExchangeAlt } from "react-icons/fa";
import { useClient } from "../contexts/ClientContext";

export default function Menu() {
  const { socket } = useClient();
  const { clientData, removeClient } = useClient();
  const shouldGetContacts = useRef(true);
  function changeClient() {
    socket.emit("log_out", "");
    removeClient();
  }
  useEffect(() => {
    if (shouldGetContacts.current) {
      shouldGetContacts.current = false;
      socket.emit("get_all_contacts");
    }
  }, []);
  const menuItems = [
    {
      link: "/createVCard",
      display: "Create vCard file (.vcf)",
      description:
        "Create a vCard file and import the file onto your client devices contacts.",
    },
    {
      link: "/validateNumbers",
      display: "Validate Numbers",
      description:
        "Validate the contacts you created vCards for, after saving the .vcf to your device",
    },
    {
      link: "/allContacts",
      display: "All Contacts",
      description:
        "Engage with your whatsapp contacts, by sending individual messages and more.",
    },
    {
      link: "/sendBulkMessages",
      display: "Send Bulk Messages",
      description:
        "Send bulk messages to as many of your whatsapp contacts as you need.",
    },
  ];

  return (
    <>
      <Link
        to="https://github.com/IshfaqAhmedProg"
        target="_blank"
        style={{ position: "absolute", top: "5%", left: "5%" }}
      >
        {console.log("clientData", clientData)}
        <Image
          src="/WhatsappBotLogo2.png"
          alt="logo"
          width="100px"
          height="auto"
          objectFit="contain"
          opacity="0.5"
          filter="saturate(0%)"
        />
      </Link>
      <Heading color="gray.700">Menu</Heading>
      <Box
        position="absolute"
        top="8%"
        right="5%"
        color="gray.700"
        textAlign="right"
      >
        <Link to="/" reloadDocument>
          <Button
            color="gray.700"
            colorScheme="blackAlpha"
            onClick={changeClient}
            size="sm"
            _hover={{ color: "red.800", borderColor: "red.800" }}
          >
            <FaExchangeAlt />
            &nbsp; Change Client
          </Button>
        </Link>
        <Box my="2">
          <Text color="gray.700">Client:</Text>
          <Text fontWeight="bold" color="whatsapp.600">
            {clientData?.name}
          </Text>
          <Text color="whatsapp.800">{clientData?.id}</Text>
        </Box>
      </Box>
      <Box
        w="70%"
        maxW="md"
        minW="xs"
        borderRadius="md"
        bg="blackAlpha.300"
        display="flex"
        alignItems="center"
        flexDirection="column"
        padding="5"
        gap="3"
      >
        {menuItems.map((item) => {
          return (
            <Link to={item.link} style={{ width: "100%" }} key={item.link}>
              <Box
                bg="blackAlpha.600"
                color="whatsapp.400"
                width="100%"
                borderRadius="md"
                padding="2"
                fontWeight="bold"
                transition="all 0.15s ease-in"
                _hover={{
                  background: "var(--chakra-colors-whatsapp-700)",
                  color: "white",
                  transform: "scale(1.01)",
                  fontSize: "1.1em",
                }}
              >
                {item.display}
                <Text fontSize="xs" color="whatsapp.700" fontWeight="normal">
                  {item.description}
                </Text>
              </Box>
            </Link>
          );
        })}
      </Box>
    </>
  );
}
