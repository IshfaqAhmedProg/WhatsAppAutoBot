import { Box, Button, IconButton, Text, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ContactCard from "../components/ContactCard";
import StatsBox from "../components/StatsBox";
import { FiArrowDown } from "react-icons/fi";
import { useClient } from "../contexts/ClientContext";
import PageTitle from "../components/PageTitle";
export default function AllContacts() {
  const { socket } = useClient();
  const itemsPerPage = 20;
  const [loading, setLoading] = useState(false);
  const [allContacts, setAllContacts] = useState([]);

  const [currentPageStat, setCurrentPageStat] = useState({
    page: 1,
    totalPages: 0,
    totalContacts: 0,
  });
  function getFragment() {
    if (currentPageStat.page <= currentPageStat.totalPages) {
      setLoading(true);
      socket.emit("get_contacts_fragment", {
        page: currentPageStat.page + 1,
        itemsPerPage,
      });
    }
  }

  useEffect(() => {
    socket.emit("get_contacts_fragment", {
      page: 1,
      itemsPerPage,
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
      <PageTitle>All Contacts</PageTitle>
      {/* {console.log("allContacts", allContacts)} */}
      <StatsBox
        count={allContacts.length}
        total={currentPageStat.totalContacts}
        title="Contacts shown"
      />

      <Box
        width="lg"
        height="md"
        borderRadius="md"
        marginY="3"
        overflowY="auto"
        display="flex"
        flexDirection="column"
        gap="0.5em"
        padding="2"
        bg="blackAlpha.400"
      >
        <Text fontWeight="bold" color="gray.700">
          Contacts in your phone
        </Text>
        {allContacts.map((contact) => {
          return <ContactCard key={contact.contactId} contact={contact} />;
        })}
        {currentPageStat.page != currentPageStat.totalPages && (
          <Tooltip label="Load more">
            <IconButton
              icon={<FiArrowDown />}
              colorScheme="blackAlpha"
              onClick={getFragment}
              isLoading={loading}
            />
          </Tooltip>
        )}
      </Box>
      <Button colorScheme="whatsapp">Download All Contacts</Button>
    </>
  );
}
