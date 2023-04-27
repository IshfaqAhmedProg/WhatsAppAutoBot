import { Box, Button, Fade, Slide, SlideFade, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import PageTitle from "../components/PageTitle";
import { FiPlus } from "react-icons/fi";
import GreetingsAndFarewells from "../assets/GreetingsAndFarewells.json";

import GreetingCard from "../components/GreetingCard";
import FarewellCard from "../components/FarewellCard";
import MessageBodyCard from "../components/MessageBodyCard";

export default function ComposeMessage() {
  const [addGreeting, setAddGreeting] = useState(false);
  const initialMessageState = {
    message: [],
    addName: false,
    senderName: "",
  };
  const [greetingMessage, setGreetingMessage] = useState(initialMessageState);
  const [farewellMessage, setFarewellMessage] = useState(initialMessageState);
  const [bodies, setBodies] = useState([]);
  const [addFarewell, setAddFarewell] = useState(false);
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
  return (
    <>
      {console.log("greetingMessage", greetingMessage)}
      {console.log("farewellMessage", farewellMessage)}
      <PageTitle>Send Bulk Message</PageTitle>
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
      <Button colorScheme="whatsapp">Select Contacts</Button>
    </>
  );
}
