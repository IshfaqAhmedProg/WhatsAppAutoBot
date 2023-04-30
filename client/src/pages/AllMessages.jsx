import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import MessageCard from "../components/MessageCard";
import { IconButton, Stack, Tooltip, useToast } from "@chakra-ui/react";

import { useClient } from "../contexts/ClientContext";
import { useNavigate } from "react-router-dom";
export default function AllMessages() {
  const { socket } = useClient();
  const [allMessages, setAllMessages] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  function sendHandler(id) {
    navigate(`/sendMessage/${id}`);
  }
  function selectHandler(id) {
    navigate(`/composeMessage/${id}`);
  }
  function deleteHandler(id) {
    socket.emit("delete_messages", { id: id }, (status) => {
      if (status.error) {
        toast({
          title: `Error deleting message!`,
          status: "error",
          duration: 5000,
          isClosable: false,
        });
        return;
      }
      if (allMessages.length != 0) {
        var mssgs = allMessages.filter((m) => m?.id != id);
        console.log(mssgs);
        setAllMessages(mssgs);
        toast({
          title: `Deleted message ${id}`,
          status: "success",
          duration: 5000,
          isClosable: false,
        });
      }
    });
  }
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
            (allMessages[message].sentTo?.length || "0") +
            " out of " +
            allMessages[message].receivers?.length;
          return (
            <MessageCard
              key={message}
              id={message}
              stats={stats}
              datetime={allMessages[message].createdAt}
              sendHandler={sendHandler}
              selectHandler={selectHandler}
              deleteHandler={deleteHandler}
            />
          );
        })}
      </Stack>
    </>
  );
}
