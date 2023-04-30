import {
  Box,
  Card,
  CardBody,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { MdContactPhone, MdSend } from "react-icons/md";
import { TbTrashXFilled } from "react-icons/tb";

export default function MessageCard({
  id,
  stats,
  datetime,
  selectHandler,
  deleteHandler,
  sendHandler,
}) {
  return (
    <Card bg="gray.800" borderRadius="md" color="whiteAlpha.800" width="100%">
      <CardBody display="flex" direction="row" justifyContent="space-between">
        <Stack>
          <Text fontWeight="bold" fontSize="lg" color="whatsapp.400">
            #
            <span style={{ color: "var(--chakra-colors-whiteAlpha-800)" }}>
              {id}
            </span>
          </Text>
          <Text color="whatsapp.700" fontSize="sm">
            {datetime}
          </Text>
        </Stack>
        <Stack alignItems="flex-end">
          <Text color="whiteAlpha.400" fontSize="xs">
            {stats}
          </Text>
          <Stack direction="row">
            <Tooltip label="Delete ">
              <IconButton
                icon={<TbTrashXFilled />}
                colorScheme="blackAlpha"
                color="whiteAlpha.600"
                _hover={{ borderColor: "red.500", color: "red.500" }}
                onClick={(e) => deleteHandler(id)}
              />
            </Tooltip>
            <Tooltip label="Select more contacts">
              <IconButton
                icon={<MdContactPhone />}
                colorScheme="blackAlpha"
                color="whiteAlpha.600"
                _hover={{ color: "whatsapp.500" }}
                onClick={(e) => selectHandler(id)}
              />
            </Tooltip>
            <Tooltip label="Send Again">
              <IconButton
                icon={<MdSend />}
                colorScheme="blackAlpha"
                color="whatsapp.500"
                onClick={(e) => sendHandler(id)}
              />
            </Tooltip>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
}
