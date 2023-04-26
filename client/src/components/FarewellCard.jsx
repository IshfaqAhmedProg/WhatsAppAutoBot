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

export default function FarewellCard({
  farewellMessage,
  handleFarewellMessage,
  handleFarewellAddSenderName,
  farewellsJson,
  toggleFarewell,
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
          Add Farewell
        </Text>
        <Text fontSize="sm" lineHeight="1">
          Add your own Farewell or choose random Farewells. Name can be company
          name or your own name.
        </Text>
      </GridItem>
      <GridItem rowStart={3} alignSelf="center" display="flex" gap={2}>
        <Input
          placeholder="Goodbye"
          _placeholder={{ fontSize: "xs" }}
          type="text"
          value={farewellMessage.message[0] || ""}
          borderColor="gray.700"
          color="whatsapp.500"
          onChange={(e) => {
            handleFarewellMessage([e.target.value]);
          }}
        />
        <Input
          placeholder="Signature"
          _placeholder={{ fontSize: "xs" }}
          type="text"
          value={farewellMessage.senderName}
          borderColor="gray.700"
          color="whatsapp.500"
          onChange={(e) => {
            handleFarewellAddSenderName(e.target.value);
          }}
        />
      </GridItem>
      <GridItem rowSpan={3} justifySelf="center">
        <Divider orientation="vertical" borderColor="whiteAlpha.300" />
      </GridItem>
      <GridItem alignSelf="center">
        <Select
          placeholder="Select Farewells"
          size="sm"
          borderColor="gray.700"
          color={
            farewellMessage.message.length != 0 ? "whatsapp.500" : "gray.700"
          }
          onChange={(e) => {
            handleFarewellMessage(
              e.target.value.split(",")[0] != ""
                ? e.target.value.split(",")
                : []
            );
          }}
        >
          <option disabled defaultValue value="" hidden>
            Select Farewells
          </option>
          {farewellsJson.map((Farewell, index) => {
            return (
              <option key={index} value={Farewell}>
                {Farewell}
              </option>
            );
          })}
          <option value={farewellsJson}>Choose Randomly</option>
        </Select>
      </GridItem>
      <GridItem
        rowSpan={2}
        alignSelf="flex-end"
        display="flex"
        justifyContent="center"
        gap={2}
      >
        <Tooltip label="Remove Farewell">
          <IconButton
            icon={<BiX fontSize="25px" />}
            bg="blackAlpha.500"
            _hover={{ borderColor: "red.500", color: "red.500" }}
            onClick={() => {
              handleFarewellMessage([]);
              handleFarewellAddSenderName("");
              toggleFarewell();
            }}
          />
        </Tooltip>
      </GridItem>
    </Grid>
  );
}
