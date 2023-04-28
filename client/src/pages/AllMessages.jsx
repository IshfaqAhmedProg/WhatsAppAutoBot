import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import ListCard from "../components/ListCard";
import { IconButton, Stack, Tooltip } from "@chakra-ui/react";
import { MdContactPhone, MdSend } from "react-icons/md";
import { TbTrashXFilled } from "react-icons/tb";
import { useClient } from "../contexts/ClientContext";
export default function AllMessages() {
  const { socket } = useClient();
  const buttons = (
    <>
      <Tooltip label="Delete ">
        <IconButton
          icon={<TbTrashXFilled />}
          colorScheme="blackAlpha"
          color="whiteAlpha.600"
          _hover={{ borderColor: "red.500", color: "red.500" }}
        />
      </Tooltip>
      <Tooltip label="Select more contacts">
        <IconButton
          icon={<MdContactPhone />}
          colorScheme="blackAlpha"
          color="whiteAlpha.600"
          _hover={{ color: "whatsapp.500" }}
        />
      </Tooltip>
      <Tooltip label="Send Again">
        <IconButton
          icon={<MdSend />}
          colorScheme="blackAlpha"
          color="whatsapp.500"
        />
      </Tooltip>
    </>
  );
  const [allMessages, setAllMessages] = useState([]);
  useEffect(() => {
    socket.emit("get_all_messages", {}, (status) => {
      if (status.error) {
        console.log("error getting messages");
      } else {
        setAllMessages(status.data);
      }
    });
  }, []);
  return (
    <>
      {console.log(allMessages)}
      <PageTitle>All Messages</PageTitle>
      <Stack
        width="80%"
        height="90%"
        bg="blackAlpha.400"
        padding={2}
        borderRadius="lg"
      >
        {Object.keys(allMessages).map((message) => {
          const stats =
            "Sent to " +
            allMessages[message].sentTo?.length +
            " out of " +
            allMessages[message].receivers?.length;
          return (
            <ListCard
              key={message}
              buttons={buttons}
              id={message}
              stats={stats}
              datetime={allMessages[message].createdAt}
            />
          );
        })}
      </Stack>
    </>
  );
}
