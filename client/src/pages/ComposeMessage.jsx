import {
  Box,
  Button,
  Fade,
  Slide,
  SlideFade,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import PageTitle from "../components/PageTitle";
import { FiPlus } from "react-icons/fi";
import GreetingsAndFarewells from "../assets/GreetingsAndFarewells.json";

import GreetingCard from "../components/GreetingCard";
import FarewellCard from "../components/FarewellCard";
import MessageBodyCard from "../components/MessageBodyCard";
import { create_UUID } from "../functions/createUUID";
import { useClient } from "../contexts/ClientContext";
import { useNavigate } from "react-router-dom";

export default function ComposeMessage() {
  const { socket } = useClient();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [addGreeting, setAddGreeting] = useState(false);
  const [addFarewell, setAddFarewell] = useState(false);
  const initialMessageState = {
    message: [],
    addName: false,
    senderName: "",
  };
  const [greetingMessage, setGreetingMessage] = useState(initialMessageState);
  const [farewellMessage, setFarewellMessage] = useState(initialMessageState);
  const [bodies, setBodies] = useState([]);
  function handleGreetingMessage(message) {
    setGreetingMessage((prev) => ({ ...prev, message: message }));
  }
  function handleGreetingAddName(addName) {
    setGreetingMessage((prev) => ({ ...prev, addName: addName }));
  }
  function toggleGreeting() {
    setAddGreeting((prev) => !prev);
  }
  function handleFarewellMessage(message) {
    setFarewellMessage((prev) => ({ ...prev, message: message }));
  }
  function handleFarewellAddSenderName(senderName) {
    setFarewellMessage((prev) => ({ ...prev, senderName: senderName }));
  }
  function toggleFarewell() {
    setAddFarewell((prev) => !prev);
  }
  function handleBodies(curr) {
    setBodies(curr);
  }
  function saveMessageToDb() {
    if (bodies.length < 1) {
      toast({
        title: `Add a body to proceed`,
        status: "info",
        duration: 2500,
        isClosable: false,
      });
      return;
    }
    setLoading(true);
    var m = {
      id: create_UUID(),
      data: {
        greetings: greetingMessage.message,
        addName: greetingMessage.addName,
        farewells: farewellMessage.message,
        senderName: farewellMessage.senderName,
        bodies: bodies,
      },
    };
    socket.emit("save_message", m, (status) => {
      toast({
        title: `Message ${m.id} saving ${status.messageSaved}!`,
        status: status.messageSaved,
        duration: 5000,
        isClosable: false,
      });
      if (status.messageSaved == "success") {
        setLoading(false);
        navigate(`/composeMessage/${m.id}`);
      }
    });
  }
  return (
    <>
      <PageTitle>Compose New Message</PageTitle>
      <Stack
        borderRadius="lg"
        width="90%"
        height="90%"
        bg="blackAlpha.400"
        padding="3"
        overflowY="auto"
        justifyContent="space-between"
      >
        {addGreeting ? (
          <Fade in={addGreeting} direction="top" unmountOnExit>
            <GreetingCard
              greetingMessage={greetingMessage}
              handleGreetingAddName={handleGreetingAddName}
              handleGreetingMessage={handleGreetingMessage}
              greetingsJson={GreetingsAndFarewells.greetings}
              toggleGreeting={toggleGreeting}
            />
          </Fade>
        ) : (
          <Button
            minH="50px"
            size="lg"
            bg="gray.800"
            color="gray.700"
            fontWeight="bold"
            leftIcon={<FiPlus fontSize="25px" />}
            onClick={toggleGreeting}
            _hover={{ bg: "blackAlpha.500", color: "whatsapp.500" }}
          >
            Add Greeting
          </Button>
        )}
        <Box bg="gray.800" height="100%">
          <MessageBodyCard bodies={bodies} handleBodies={handleBodies} />
        </Box>
        {addFarewell ? (
          <Fade in={addFarewell} direction="bottom" unmountOnExit>
            <FarewellCard
              farewellMessage={farewellMessage}
              handleFarewellAddSenderName={handleFarewellAddSenderName}
              handleFarewellMessage={handleFarewellMessage}
              farewellsArray={GreetingsAndFarewells.farewells}
              toggleFarewell={toggleFarewell}
            />
          </Fade>
        ) : (
          <Button
            minH="50px"
            size="lg"
            bg="gray.800"
            color="gray.700"
            leftIcon={<FiPlus fontSize="25px" />}
            onClick={toggleFarewell}
            fontWeight="bold"
            _hover={{ bg: "blackAlpha.500", color: "whatsapp.500" }}
          >
            Add Farewell
          </Button>
        )}
      </Stack>
      <Button
        colorScheme="whatsapp"
        isLoading={loading}
        // isDisabled={bodies.length == 0 ? true : false}
        onClick={saveMessageToDb}
      >
        Select Contacts
      </Button>
    </>
  );
}
