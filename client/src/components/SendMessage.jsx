import React, { useEffect, useRef, useState } from "react";
import PageTitle from "./PageTitle";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useClient } from "../contexts/ClientContext";
import { useNavigate, useParams } from "react-router-dom";
import ContactCard from "./ContactCard";
import { BiCheck, BiCog, BiPause, BiPlay, BiX } from "react-icons/bi";
import getRandom from "../functions/getRandom";
import { generateMessage } from "../functions/generateMessage";
import StatsBox from "./StatsBox";
const range = { max: 15000, min: 10000 };
const initialRandom = getRandom(range.max, range.min);

export default function SendMessage() {
  const { socket } = useClient();
  const messageId = useParams().messageId;
  const toast = useToast();
  const getReceivers = useRef(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [receiversData, setReceviersData] = useState([]);
  const [messageData, setMessageData] = useState({});
  const [paused, setPaused] = useState(true);
  const [countdown, setCountdown] = useState(initialRandom); // initial countdown value between 5s and 10s
  const [maxCountdown, setMaxCountdown] = useState(initialRandom);
  const [activeMessage, setActiveMessage] = useState(0);
  const [sentTo, setSentTo] = useState([]);
  function handlePause() {
    setPaused(true);
  }
  function handleResume() {
    setPaused(false);
  }
  useEffect(() => {
    let intervalId;
    if (!paused) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1000);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [paused]);

  useEffect(() => {
    if (countdown < 300) {
      //Trigger message sending
      const rand = getRandom(range.max, range.min);
      setCountdown(rand);
      setMaxCountdown(rand);
    }
  }, [countdown]);
  useEffect(() => {
    socket.emit("get_message_data", { id: messageId }, (mssgData) => {
      setLoading(true);
      if (mssgData.status == "error") {
        toast({
          title: `Error getting message data!`,
          status: "error",
          duration: 5000,
          isClosable: false,
        });
        return;
      }
      setMessageData(mssgData);
      getReceivers.current = true;
    });
  }, []);
  useEffect(() => {
    if (getReceivers.current) {
      socket.emit(
        "get_contact_by_id",
        { contacts: messageData.receivers },
        (receiversData) => {
          if (receiversData.status != "error") {
            setReceviersData(receiversData);
          } else {
            toast({
              title: `Error getting receiver data!`,
              status: "error",
              duration: 5000,
              isClosable: false,
            });
          }
        }
      );
      getReceivers.current = false;
      setLoading(false);
    }
  }, [messageData.receivers]);

  useEffect(() => {
    if (countdown < 300 && receiversData.length > 0) {
      //Send message to next receiver
      if (activeMessage < receiversData.length) {
        const receiver = receiversData[activeMessage];
        socket.emit(
          "send_message",
          {
            id: messageId,
            to: receiver?.contactChatId,
            message: generateMessage(messageData, receiver?.contactName),
          },
          (response) => {
            if (response.status === "error") {
              toast({
                title: `Error sending message to ${receiver.contactName}`,
                status: "error",
                duration: 2500,
                isClosable: false,
              });
              //pause on error
              setPaused(true);
            } else {
              toast({
                title: `Message sent to ${receiver.contactName}`,
                status: "success",
                duration: 2500,
                isClosable: false,
              });
              setSentTo((prev) => [...prev, receiver.contactChatId]);
            }
          }
        );
        setActiveMessage((prevActiveMessage) => prevActiveMessage + 1);
      } else {
        toast({
          title: `All messages sent for ${messageId}`,
          status: "success",
          duration: 5000,
          isClosable: false,
        });
        navigate("/menu");
        setPaused(true);
      }
    }
  }, [countdown, receiversData, activeMessage, messageData]);
  return (
    <>
      {/* {console.log(maxCountdown)} */}
      {/* {console.log(countdown)} */}
      {console.log(receiversData)}
      {console.log(messageData)}
      <PageTitle>Sending Messages</PageTitle>
      <StatsBox
        count={sentTo.length}
        total={receiversData.length}
        title="Messages sent"
      />
      <Stack width="80%" height="100%">
        <Stack bg="gray.800" borderRadius="lg" padding={2}>
          <Stack direction="row" justifyContent="space-between">
            <Stat colorScheme="whatsapp" color="whiteAlpha.600">
              <StatLabel fontWeight="bold">
                {activeMessage === 0
                  ? "Press start to begin"
                  : activeMessage === receiversData?.length
                  ? "Wait while you are redirected in"
                  : !paused
                  ? "Sending message in"
                  : "Resume sending message"}
              </StatLabel>
              <StatNumber fontWeight="bold">
                <span style={{ color: "var(--chakra-colors-whatsapp-500)" }}>
                  {(countdown / 1000).toFixed(1)}
                </span>
                s
              </StatNumber>
              <StatHelpText>
                Reciever:
                <strong>{receiversData[activeMessage]?.contactName}</strong>
              </StatHelpText>
            </Stat>
            <Stack direction="row">
              {activeMessage === 0 ? (
                <Button colorScheme="whatsapp" onClick={handleResume}>
                  Start
                </Button>
              ) : paused ? (
                <Tooltip label="Start">
                  <IconButton
                    icon={<BiPlay />}
                    fontSize="xl"
                    colorScheme="blackAlpha"
                    color="gray.800"
                    onClick={handleResume}
                  />
                </Tooltip>
              ) : (
                <Tooltip label="Pause">
                  <IconButton
                    icon={<BiPause />}
                    fontSize="xl"
                    colorScheme="blackAlpha"
                    color="gray.800"
                    onClick={handlePause}
                  />
                </Tooltip>
              )}
              <Tooltip label="Stop sending process">
                <IconButton
                  icon={<BiX fontSize="25px" />}
                  bg="blackAlpha.500"
                  _hover={{ borderColor: "red.500", color: "red.500" }}
                />
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          bg="blackAlpha.400"
          height="70%"
          borderRadius="lg"
          overflowY="auto"
          padding={2}
        >
          {receiversData.map((receiver, index) => {
            return (
              <Box key={receiver.contactId} position="relative">
                <ContactCard
                  isLoading={loading}
                  isSelectable={false}
                  contact={receiver}
                  progressBar={true}
                  progress={
                    index === activeMessage
                      ? 100 - (countdown / maxCountdown) * 100
                      : index < activeMessage
                      ? 100
                      : 0
                  }
                />
                <Box
                  borderRadius="50%"
                  position="absolute"
                  bottom="10%"
                  right="5%"
                  width="16px"
                  height="16px"
                  bg={
                    index === activeMessage
                      ? "gray.500"
                      : index < activeMessage
                      ? "whatsapp.500"
                      : "blackAlpha.300"
                  }
                >
                  {index === activeMessage ? (
                    <BiCog />
                  ) : index < activeMessage ? (
                    <BiCheck />
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </>
  );
}
