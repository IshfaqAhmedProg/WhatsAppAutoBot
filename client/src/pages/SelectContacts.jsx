import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  IconButton,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  TagRightIcon,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ContactCard from "../components/ContactCard";
import StatsBox from "../components/StatsBox";
import { FiArrowDown } from "react-icons/fi";
import { useClient } from "../contexts/ClientContext";
import PageTitle from "../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { MdCheck } from "react-icons/md";
export default function AllContacts() {
  const { socket } = useClient();
  const navigate = useNavigate();
  const messageId = useParams().messageId;
  const itemsPerPage = 100;
  const [loading, setLoading] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [messageData, setMessageData] = useState({});
  const [currentPageStat, setCurrentPageStat] = useState({
    page: 1,
    totalPages: 0,
    totalContacts: 0,
  });
  const toast = useToast();
  function loadMoreContacts() {
    if (currentPageStat.page <= currentPageStat.totalPages) {
      setLoading(true);
      socket.emit("get_contacts_fragment", {
        page: currentPageStat.page + 1,
        itemsPerPage,
      });
    }
  }
  const handleCheckAll = (e) => {
    setSelectedContacts(
      e.target.checked
        ? [...allContacts.map((contact) => contact.contactChatId)]
        : []
    );
  };
  function sendMessage(e, toAll) {
    // console.log(toAll, messageId, selectedContacts);
    socket.emit(
      "save_receivers",
      {
        id: messageId,
        toAll: toAll,
        receivers: selectedContacts,
      },
      (status) => {
        toast({
          title: `Receivers for message ${messageId} saving ${status.receiversSaved}!`,
          status: status.receiversSaved,
          duration: 5000,
          isClosable: false,
        });
        if (status.receiversSaved == "success") {
          setLoading(false);
          navigate(`/sendMessage/${messageId}`);
        }
      }
    );
  }
  useEffect(() => {
    setLoading(true);
    socket.emit("get_contacts_fragment", {
      page: 1,
      itemsPerPage,
    });
    socket.emit("get_message_data", { id: messageId }, (mssgData) => {
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
      if (mssgData.receivers)
        setSelectedContacts((prev) => [
          ...new Set([...prev, ...mssgData.receivers]),
        ]);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    socket.on("set_contacts_fragment", (data) => {
      // console.log("response", data);
      setAllContacts((allContacts) =>
        [
          ...new Set(
            [...allContacts, ...data.items].map((obj) => JSON.stringify(obj))
          ),
        ].map((str) => JSON.parse(str))
      );
      setCurrentPageStat({
        page: data.page,
        totalPages: data.totalPages,
        totalContacts: data.totalContacts,
      });
      setLoading(false);
    });
  }, [socket]);

  return (
    <>
      <PageTitle>Select Contacts</PageTitle>
      {/* {console.log("allContacts", allContacts)} */}
      {console.log("selected", selectedContacts)}
      {console.log("mssgData", messageData?.receivers)}
      <StatsBox
        count={selectedContacts.length}
        total={currentPageStat.totalContacts}
        title="Contacts selected"
      />
      <Text maxW="lg" color="whatsapp.500" textAlign="center">
        You can select the contacts to send the message to, or click on 'Send to
        all in phone' to send to all contacts in the phone, all contacts might
        not be shown below.
      </Text>
      <Box
        width="80%"
        height="70%"
        borderRadius="md"
        marginY="3"
        overflowY="auto"
        display="flex"
        flexDirection="column"
        gap="0.5em"
        bg="blackAlpha.400"
      >
        <Accordion
          defaultIndex={[0]}
          allowMultiple
          display="flex"
          flexDirection="column"
          gap="2"
        >
          <AccordionItem borderWidth="0">
            <AccordionButton justifyContent="space-between" alignItems="center">
              <Stack
                direction="row"
                justifyContent="space-between"
                width="full"
                color="gray.500"
                paddingRight={2}
              >
                <Text fontWeight="bold">Contacts in your phone</Text>
                <Checkbox
                  colorScheme="whatsapp"
                  isIndeterminate={
                    selectedContacts.length > 0 &&
                    selectedContacts.length < allContacts.length
                  }
                  onChange={handleCheckAll}
                  isChecked={selectedContacts.length === allContacts.length}
                >
                  <Text fontSize="sm">Select all</Text>
                </Checkbox>
              </Stack>
              <AccordionIcon color="whatsapp.400" />
            </AccordionButton>
            <AccordionPanel display="flex" flexDirection="column" gap="2">
              <CheckboxGroup
                value={selectedContacts}
                onChange={(value) => setSelectedContacts(value)}
              >
                {allContacts.map((contact) => {
                  if (contact.contactName != "unavailable")
                    return (
                      <Box position="relative">
                        <ContactCard
                          key={contact.contactId}
                          contact={contact}
                          isLoading={loading}
                          isSelectable
                        />
                        {messageData.sentTo?.includes(
                          contact.contactChatId
                        ) && (
                          <Tag
                            size="sm"
                            position="absolute"
                            bottom="10%"
                            right="3%"
                            colorScheme="whatsapp"
                            borderRadius="md"
                            variant="solid"
                            color="whatsapp.800"
                          >
                            <TagLabel>Already sent</TagLabel>
                            <TagRightIcon as={MdCheck} />
                          </Tag>
                        )}
                      </Box>
                    );
                })}
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem borderWidth="0" borderColor="blackAlpha.100">
            <AccordionButton justifyContent="space-between" alignItems="center">
              <Stack
                direction="row"
                justifyContent="space-between"
                width="full"
              >
                <Text fontWeight="bold" color="gray.700">
                  Select from Contact groups
                </Text>
              </Stack>
              <AccordionIcon color="whatsapp.400" />
            </AccordionButton>
            <AccordionPanel display="flex" flexDirection="column" gap="2">
              <Text fontWeight="bold">Coming Soon!</Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        {currentPageStat.page != currentPageStat.totalPages && (
          <Tooltip label="Load more">
            <IconButton
              icon={<FiArrowDown />}
              colorScheme="blackAlpha"
              onClick={loadMoreContacts}
              isLoading={loading}
            />
          </Tooltip>
        )}
      </Box>

      <Stack direction="row">
        <Button
          colorScheme="blackAlpha"
          onClick={(e) => sendMessage(e, false)}
          isDisabled={selectedContacts.length == 0 ? true : false}
        >
          Send to selected
        </Button>
        <Button colorScheme="blackAlpha" onClick={(e) => sendMessage(e, true)}>
          Send to all in phone
        </Button>
      </Stack>
    </>
  );
}
