import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Heading,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ContactCard from "../components/ContactCard";
import StatsBox from "../components/StatsBox";
import { useClient } from "../contexts/ClientContext";

export default function SendBulkMessages() {
  const { socket } = useClient();
  const [message, setMessage] = useState("");
  const [localContacts, setLocalContacts] = useState([]);
  const [whatsappContacts, setWhatsappContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  function selectContacts(contact) {
    const contacts = [...selectedContacts];
    if (contacts.indexOf(contact) != -1) {
      contacts.splice(contacts.indexOf(contact), 1);
    } else {
      contacts.length < 150 &&
        setSelectedContacts([...selectedContacts, contact]);
    }
  }
  function selectAllContacts(e, type) {
    if (!e.target.checked) {
      setSelectedContacts([]);
      return;
    }
    if (type == "local") {
      contacts.length < 150 &&
        setSelectedContacts([
          ...selectedContacts,
          ...localContacts.map((contact) => contact.contactChatId),
        ]);
    } else if (type == "whatsapp") {
      contacts.length < 150 &&
        setSelectedContacts([
          ...selectedContacts,
          ...whatsappContacts.map((contact) => contact.contactChatId),
        ]);
    }
  }

  function sendMessage() {
    if (selectContacts.length != 0 && message != "") {
      setLoading(true);
      socket.emit("send_message", {
        message: message,
        reciever: selectedContacts,
      });
    }
  }
  useEffect(() => {
    socket.on("set_all_contacts", (data) => {
      setLocalContacts([
        ...data.filter((contact) => contact.contactName != "unavailable"),
      ]);
      setWhatsappContacts([
        ...data.filter((contact) => contact.contactName == "unavailable"),
      ]);
      setLoading(false);
    });
    socket.on("message_sent", (sent) => {
      if (sent)
        toast({
          title: "Message Sent",
          description: `Your message has been succesfully sent!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      else
        toast({
          title: "Message Sending Failed",
          description: `Message sending failed!`,
          status: "error",
          duration: 5000,
          isClosable: false,
        });
      setLoading(false);
    });
  }, [socket]);
  useEffect(() => {
    setLoading(true);
    socket.emit("get_all_contacts");
  }, []);
  return (
    <>
      {console.log(selectedContacts)}

      <Heading color="gray.700">Send Bulk Messages</Heading>

      <StatsBox
        count={selectedContacts.length}
        total={localContacts.length + whatsappContacts.length}
        title="Selected Contacts"
      />
      <Stack height="md" alignItems="center" position="relative" gap={5}>
        <Textarea
          value={message}
          placeholder="Type your message here."
          color="gray.500"
          onChange={(e) => setMessage(e.target.value)}
          maxW="md"
          height="50%"
          borderColor="whatsapp.600"
          _active={{ borderColor: "whatsapp.400" }}
          disabled={loading}
        />

        <Box
          width="lg"
          // borderWidth="1px"
          // borderColor="whatsapp.800"
          borderRadius="md"
          marginY="3"
          overflowY="auto"
          bg="blackAlpha.300"
        >
          <Accordion
            defaultIndex={[0]}
            allowMultiple
            display="flex"
            flexDirection="column"
            gap="2"
          >
            <AccordionItem borderWidth="0">
              <AccordionButton
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row">
                  <Text fontWeight="bold" color="gray.700">
                    Contacts in your phone
                  </Text>
                  <Checkbox
                    color="gray.600"
                    colorScheme="whatsapp"
                    onChange={(e) => selectAllContacts(e, "local")}
                    isChecked={selectedContacts.some((el) =>
                      localContacts
                        .map(({ contactChatId }) => contactChatId)
                        .includes(el)
                    )}
                  />
                </Stack>
                <AccordionIcon color="whatsapp.400" />
              </AccordionButton>
              <AccordionPanel display="flex" flexDirection="column" gap="2">
                {localContacts.map((contact) => {
                  if (contact.contactName != "unavailable")
                    return (
                      <ContactCard
                        key={contact.contactId}
                        contact={contact}
                        isLoading={loading}
                        isSelectable
                        select={selectContacts}
                        selected={selectedContacts}
                      />
                    );
                })}
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem borderWidth="0" borderColor="blackAlpha.100">
              <AccordionButton
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row">
                  <Text fontWeight="bold" color="gray.700">
                    Contacts in WhatsApp's database
                  </Text>
                  <Checkbox
                    color="gray.600"
                    colorScheme="whatsapp"
                    onChange={(e) => selectAllContacts(e, "whatsapp")}
                    isChecked={selectedContacts.some((el) =>
                      whatsappContacts
                        .map(({ contactChatId }) => contactChatId)
                        .includes(el)
                    )}
                  />
                </Stack>
                <AccordionIcon color="whatsapp.400" />
              </AccordionButton>
              <AccordionPanel display="flex" flexDirection="column" gap="2">
                {whatsappContacts.map((contact) => {
                  return (
                    <ContactCard
                      key={contact.contactId}
                      contact={contact}
                      isLoading={loading}
                      isSelectable
                      select={selectContacts}
                      selected={selectedContacts}
                    />
                  );
                })}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Stack>
      <Button colorScheme="whatsapp" isLoading={loading} onClick={sendMessage}>
        Send
      </Button>
    </>
  );
}
