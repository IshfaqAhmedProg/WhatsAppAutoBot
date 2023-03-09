import {
  Badge,
  Box,
  Button,
  Heading,
  Image,
  LinkOverlay,
  Stat,
  StatLabel,
  StatNumber,
  Tag,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../index.css";
import { FaExchangeAlt } from "react-icons/fa";

export default function Menu({ socket }) {
  const clientData = useLocation();
  console.log(clientData.state);
  const navigate = useNavigate();
  function changeClient() {
    socket.emit("log_out", "");
  }

  const menuItems = [
    {
      link: "/createVCard",
      display: "Create vCard file (.vcf)",
      description:
        "Create a vCard file and import the file onto your client devices contacts.",
    },
    {
      link: "/validateContacts",
      display: "Validate Contacts",
      description: "Check if contacts that you imported are whatsapp or not.",
    },
    {
      link: "/getContactData",
      display: "Get Whatsapp contacts data",
      description:
        "Get all the whatsapp contacts and their data, including profile picture.",
    },
    {
      link: "/sendMessage",
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
          <Text color="gray.700" fontSize="xs">
            Client:
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="whatsapp.600">
            {clientData?.state.name}
          </Text>
          <Text fontSize="sm" color="whatsapp.800">
            {clientData?.state.id}
          </Text>
        </Box>
      </Box>
      <Box
        width="50%"
        height="50%"
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
