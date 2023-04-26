import React from "react";
import {
  Divider,
  Grid,
  GridItem,
  IconButton,
  Input,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FaAddressCard, FaCheck } from "react-icons/fa";
import { BiX } from "react-icons/bi";
import { MdContactPhone } from "react-icons/md";

export default function GreetingCard({
  greetingMessage,
  handleGreetingMessage,
  handleGreetingAddName,
  greetingsJson,
  toggleGreeting,
}) {
  return (
    <Grid
      maxHeight="116px"
      bg="gray.800"
      padding="2"
      borderRadius="md"
      templateRows="2fr 1fr 2fr"
      templateColumns="2fr 0.1fr 0.8fr"
      color="gray.500"
    >
      <GridItem rowSpan={2}>
        <Text fontWeight="bold" color="whatsapp.500">
          Add Greeting
        </Text>
        <Text fontSize="sm" lineHeight="1">
          Add your own greeting or choose random greetings.
        </Text>
      </GridItem>
      <GridItem rowStart={3} alignSelf="center">
        <Input
          placeholder="Hello,"
          _placeholder={{ fontSize: "xs" }}
          type="text"
          value={
            greetingMessage.message[0]
              ? !greetingMessage.addName
                ? greetingMessage.message[0]
                : greetingMessage.message[0] + " [CONTACTNAME]"
              : ""
          }
          borderColor="gray.700"
          color="whatsapp.500"
          onChange={(e) => {
            handleGreetingMessage([e.target.value]);
          }}
        />
      </GridItem>
      <GridItem rowSpan={3} justifySelf="center">
        <Divider orientation="vertical" borderColor="whiteAlpha.300" />
      </GridItem>
      <GridItem alignSelf="center">
        <Select
          placeholder="Select Greetings"
          size="sm"
          color={
            greetingMessage.message.length != 0 ? "whatsapp.500" : "gray.700"
          }
          onChange={(e) => {
            handleGreetingMessage(
              e.target.value.split(",")[0] != ""
                ? e.target.value.split(",")
                : []
            );
          }}
          borderColor="gray.700"
          _placeholder={{ color: "red.500" }}
        >
          <option disabled defaultValue value="" hidden>
            Select Greetings
          </option>
          {greetingsJson.map((greeting, index) => {
            return (
              <option key={index} value={greeting}>
                {greeting}
              </option>
            );
          })}
          <option value={greetingsJson}>Choose Randomly</option>
        </Select>
      </GridItem>
      <GridItem
        rowSpan={2}
        alignSelf="flex-end"
        display="flex"
        justifyContent="center"
        gap={2}
      >
        <Tooltip label="Add contact's name to the greeting">
          <IconButton
            colorScheme="blackAlpha"
            icon={greetingMessage.addName ? <FaCheck /> : <MdContactPhone />}
            bg={greetingMessage.addName ? "whatsapp.500" : "blackAlpha.500"}
            color={greetingMessage.addName ? "whatsapp.800" : "whiteAlpha.600"}
            onClick={() => {
              handleGreetingAddName(!greetingMessage.addName);
            }}
          />
        </Tooltip>
        <Tooltip label="Remove greeting">
          <IconButton
            icon={<BiX fontSize="25px" />}
            colorScheme="blackAlpha"
            color="whiteAlpha.600"
            _hover={{ borderColor: "red.500", color: "red.500" }}
            onClick={() => {
              handleGreetingMessage([]);
              handleGreetingAddName(false);
              toggleGreeting();
            }}
          />
        </Tooltip>
      </GridItem>
    </Grid>
  );
}
