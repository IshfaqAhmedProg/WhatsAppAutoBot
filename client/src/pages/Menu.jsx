import { Box, Button, Image, Text, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { FaExchangeAlt, FaQuestion } from "react-icons/fa";
import { useClient } from "../contexts/ClientContext";
import PageTitle from "../components/PageTitle";

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
      link: "/createValidationTask",
      display: "Create Validation Task",
      description:
        "Create a vCard file and import the file onto your client devices contacts.",
    },
    {
      link: "/validateNumbers",
      display: "Validation Tasks",
      description:
        "Check validation tasks and validate the contacts you created vCards for, after saving the .vcf to your device",
    },
    {
      link: "/allContacts",
      display: "All Contacts",
      description:
        "Engage with your whatsapp contacts, by sending individual messages and more.",
    },
    {
      link: "/composeMessage",
      display: "Compose New Message",
      description:
        "Compose a new message and then select contacts to send the messages to.",
    },
    {
      link: "/allMessages",
      display: "All Messages",
      description:
        "Resend messages to other users or resume if the message sending was stopped",
    },
  ];

  return (
    <>
      <Box textAlign={"right"} position="absolute" right={"5%"} top={"5%"}>
        
        <Box display={"flex"} gap={2}>
          <Link to="/" reloadDocument>
            <Tooltip label="Change client">
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
            </Tooltip>
          </Link>
          <Link to="/learnMore">
            <Tooltip label="Learn more">
              <Button color="gray.700" colorScheme="blackAlpha" size="sm">
                <FaQuestion />
              </Button>
            </Tooltip>
          </Link>
        </Box>
        <Box my="2">
          <Text color="gray.700">Client:</Text>
          <Text fontWeight="bold" color="whatsapp.600">
            {clientData?.name}
          </Text>
          <Text color="whatsapp.800">{clientData?.id}</Text>
        </Box>
      </Box>
      <Link
        to="https://github.com/IshfaqAhmedProg/WhatsAppAutoBot"
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
      <PageTitle>Menu</PageTitle>

      <Box
        w="70%"
        maxW="sm"
        minW="sm"
        borderRadius="md"
        bg="blackAlpha.400"
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
      <Box position={"absolute"} top={"20%"} left={"80%"}></Box>
    </>
  );
}
