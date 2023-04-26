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
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { FaPlus, FaSave } from "react-icons/fa";
import { TbTrashXFilled } from "react-icons/tb";
import { HiVariable } from "react-icons/hi";
import { create_UUID } from "../Functions/createUUID";
export default function MessageBodyCard() {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);
  const [bodies, setBodies] = useState([]);
  const [textData, setTextData] = useState("");
  const bodyPlaceholder = `We're excited to welcome you to the [BRAND] family!
  
  Watching our Onboarding Tutorial will help you familiarize yourself with [PRODUCT].
  
  If you need any help at all, drop us a line anytime at [EMAIL] or Tweet us [SOCIALMEDIA1] We'll be more than happy to lend a hand!`;
  function addToBodies() {
    setBodies((prev) => [...prev, { message: textData, id: create_UUID() }]);
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
      {console.log(textData)}
      <GridItem rowSpan={3}>
        <Stack height="100%">
          <Text fontWeight="bold" color="whatsapp.500">
            Add Body
          </Text>
          <Textarea
            placeholder={bodyPlaceholder}
            _placeholder={{ fontSize: "xs" }}
            value={textData}
            height="full"
            borderColor="gray.700"
            color="whatsapp.500"
            onChange={(e) => setTextData(e.target.value)}
          />
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
            <PopoverContent
              bg="gray.900"
              borderColor="whatsapp.600"
              padding={2}
            >
              <PopoverArrow bg="gray.900" />
              <PopoverCloseButton />
              <PopoverHeader>
                <Text fontWeight="bold" fontSize="md">
                  Add Variables
                </Text>
              </PopoverHeader>
              <PopoverBody>
                <Stack
                  fontSize="sm"
                  color="whatsapp.500"
                  fontWeight="bold"
                  textAlign="right"
                >
                  <Input
                    placeholder="[CONTACTNAME]"
                    type="text"
                    size="sm"
                    borderColor="gray.700"
                  />
                  <Input
                    placeholder="[PRODUCT]"
                    type="text"
                    size="sm"
                    borderColor="gray.700"
                  />
                  <Input
                    placeholder="[BRAND]"
                    type="text"
                    size="sm"
                    borderColor="gray.700"
                  />
                  <Input
                    placeholder="[EMAIL]"
                    type="text"
                    size="sm"
                    borderColor="gray.700"
                  />
                  <Input
                    placeholder="[SOCIALMEDIA1]"
                    type="text"
                    size="sm"
                    borderColor="gray.700"
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
          <Select placeholder="Select Body" size="sm" borderColor="gray.700">
            <option>option1</option>
            <option>option1</option>
            <option>option1</option>
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
              />
            </Tooltip>
            <Tooltip label="Add a new body">
              <IconButton
                icon={<FaPlus />}
                colorScheme="blackAlpha"
                color="whiteAlpha.600"
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
