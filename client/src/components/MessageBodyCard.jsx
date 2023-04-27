import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { FaPlus, FaSave } from "react-icons/fa";
import { TbTrashXFilled } from "react-icons/tb";
import { HiVariable } from "react-icons/hi";
export default function MessageBodyCard({ bodies, handleBodies }) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const initialiseMessage = { message: "", id: "" };
  const firstFieldRef = useRef(null);
  const [activeBody, setActiveBody] = useState(initialiseMessage);
  const [variables, setVariables] = useState({
    BRAND: "",
    PRODUCT: "",
    EMAIL: "",
    SOCIALMEDIA1: "",
  });
  const toast = useToast();
  const bodyPlaceholder = `We're excited to welcome you to the [BRAND] family!
  
Watching our Onboarding Tutorial will help you familiarize yourself with [PRODUCT].
  
If you need any help at all, drop us a line anytime at [EMAIL] or Tweet us [SOCIALMEDIA1] We'll be more than happy to lend a hand!`;

  async function addToBodies() {
    var messageToAdd = activeBody.message;
    messageToAdd = await compileMessage(messageToAdd, variables);
    // console.log("messageToAdd", messageToAdd);
    var mssgId =
      activeBody.id != ""
        ? activeBody.id
        : "body " + parseFloat(bodies.length + 1);
    var shallowBody = bodies;
    var bodyIndex = shallowBody.findIndex((body) => body.id === mssgId);
    if (bodyIndex < 0) {
      //if body exist then delete the body and add the new one
      shallowBody.push({ message: messageToAdd, id: mssgId });
    } else {
      //else just add the new one
      shallowBody[bodyIndex] = { message: messageToAdd, id: mssgId };
    }
    // console.log("shallowBody", shallowBody);
    setActiveBody({ message: messageToAdd, id: mssgId });
    handleBodies(shallowBody);
    toast({
      title: "Body saved!",
      status: "success",
      duration: 2000,
      isClosable: false,
    });
  }
  async function compileMessage(message, v) {
    var m = message;
    const regex = new RegExp(
      "\\[" + Object.keys(v).join("\\]|\\[") + "\\]",
      "g"
    );
    const newText = m.replace(regex, (matched) => {
      const key = matched.slice(1, -1);
      return v[key] !== "" ? v[key] : "#NOTFOUND";
    });
    return newText;
  }
  function handleBodySelect(e) {
    if (e.target.value) {
      var active = bodies.find((body) => body.id === e.target.value);
      setActiveBody(active);
    }
  }
  function deleteBody() {
    var shallowBody = bodies;
    var bodyIndex = bodies.findIndex((body) => body.id === activeBody.id);
    shallowBody.splice(bodyIndex, 1);
    toast({
      title: `${activeBody.id} deleted!`,
      status: "success",
      duration: 2000,
      isClosable: false,
    });
    setActiveBody(initialiseMessage);
    handleBodies(shallowBody);
  }
  return (
    <Grid
      height="100%"
      padding="2"
      borderRadius="md"
      templateRows="0.8fr 0.1fr 1fr"
      templateColumns="2fr 0.1fr 0.8fr"
      color="gray.500"
    >
      {/* {console.log(bodies)} */}
      {/* {console.log(textData)} */}
      <GridItem rowSpan={3}>
        <Stack height="100%">
          <Text fontWeight="bold" color="whatsapp.500">
            Add Body
          </Text>
          <Box position="relative" height="full">
            <Textarea
              placeholder={bodyPlaceholder}
              _placeholder={{ fontSize: "xs" }}
              value={activeBody.message}
              height="full"
              borderColor="gray.700"
              color="whatsapp.500"
              onChange={(e) =>
                setActiveBody({
                  ...activeBody,
                  message: e.target.value,
                })
              }
            />
          </Box>
        </Stack>
      </GridItem>
      <GridItem rowSpan={3} justifySelf="center">
        <Divider orientation="vertical" borderColor="whiteAlpha.300" />
      </GridItem>
      <GridItem placeSelf="center">
        <Stack alignItems="center">
          <Text fontSize="sm" textAlign="center">
            If you use any{" "}
            <strong>
              {"["}VARIABLES{"]"}
            </strong>{" "}
            make sure to add them here
          </Text>
          <Popover
            isOpen={isOpen}
            initialFocusRef={firstFieldRef}
            onOpen={onOpen}
            onClose={onClose}
            placement="top"
            closeOnBlur={false}
          >
            <PopoverTrigger>
              <IconButton
                icon={<HiVariable />}
                fontSize="20px"
                colorScheme="blackAlpha"
                color="whiteAlpha.600"
              />
            </PopoverTrigger>
            <PopoverContent bg="gray.900" borderColor="gray.700" padding={2}>
              <PopoverArrow bg="gray.900" />
              <PopoverCloseButton />
              <PopoverHeader borderColor="gray.700">
                <Text fontWeight="bold" fontSize="md">
                  Add Variables
                </Text>
              </PopoverHeader>
              <PopoverBody>
                <Stack fontSize="sm" color="whatsapp.500">
                  <Text>
                    For using the contact name on the body use{" "}
                    <strong>
                      {"["}CONTACTNAME
                      {"]"}
                    </strong>
                    , for the other values add them here.
                  </Text>
                  <Input
                    placeholder="[PRODUCT]"
                    type="text"
                    size="sm"
                    borderColor="gray.700"
                    value={variables.PRODUCT}
                    onChange={(e) => {
                      setVariables({ ...variables, PRODUCT: e.target.value });
                    }}
                  />
                  <Input
                    placeholder="[BRAND]"
                    type="text"
                    size="sm"
                    borderColor="gray.700"
                    value={variables.BRAND}
                    onChange={(e) => {
                      setVariables({ ...variables, BRAND: e.target.value });
                    }}
                  />
                  <Input
                    placeholder="[EMAIL]"
                    type="text"
                    size="sm"
                    borderColor="gray.700"
                    value={variables.EMAIL}
                    onChange={(e) => {
                      setVariables({ ...variables, EMAIL: e.target.value });
                    }}
                  />
                  <Input
                    placeholder="[SOCIALMEDIA1]"
                    type="text"
                    size="sm"
                    borderColor="gray.700"
                    value={variables.SOCIALMEDIA1}
                    onChange={(e) => {
                      setVariables({
                        ...variables,
                        SOCIALMEDIA1: e.target.value,
                      });
                    }}
                  />
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Stack>
      </GridItem>
      <GridItem alignSelf="center">
        <Divider orientation="horizontal" borderColor="whiteAlpha.300" />
      </GridItem>
      <GridItem alignSelf="center">
        <Stack alignItems="center">
          <Select
            placeholder="Select Body"
            size="sm"
            borderColor="gray.700"
            onChange={handleBodySelect}
            value={activeBody.id}
          >
            {bodies.map((body) => {
              if (body.id) {
                return (
                  <option value={body.id} key={body.id}>
                    {body.id}
                  </option>
                );
              }
            })}
          </Select>
          <Box
            flexDirection="row"
            display="flex"
            justifyContent="center"
            gap={2}
            height="100%"
          >
            <Tooltip label="Delete this body">
              <IconButton
                icon={<TbTrashXFilled />}
                colorScheme="blackAlpha"
                color="whiteAlpha.600"
                _hover={{ borderColor: "red.500", color: "red.500" }}
                onClick={deleteBody}
                isDisabled={activeBody.id == ""}
              />
            </Tooltip>
            <Tooltip label="Add a new body">
              <IconButton
                icon={<FaPlus />}
                colorScheme="blackAlpha"
                color="whiteAlpha.600"
                onClick={() => {
                  setActiveBody(initialiseMessage);
                }}
              />
            </Tooltip>
          </Box>
          <Box>
            <Button
              leftIcon={<FaSave />}
              colorScheme="blackAlpha"
              color="whiteAlpha.600"
              onClick={addToBodies}
            >
              Save
            </Button>
          </Box>
        </Stack>
      </GridItem>
    </Grid>
  );
}
