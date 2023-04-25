import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  IconButton,
  Image,
  Stack,
  Tag,
  TagLabel,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { RxSlash } from "react-icons/rx";
import ContactCard from "../components/ContactCard";
import StatsBox from "../components/StatsBox";
import { downloadFile } from "../Functions/downloadFile";
import { FiArrowDown } from "react-icons/fi";
import { useClient } from "../contexts/ClientContext";
import PageTitle from "../components/PageTitle";
export default function AllContacts() {
  const { socket } = useClient();
  const itemsPerPage = 20;
  const [loading, setLoading] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [contactsStat, setContactsStat] = useState({
    totalContacts: 0,
    totalWhatsAppContacts: 0,
  });
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
      console.log("response", data);
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
      {console.log("allContacts", allContacts)}
      <StatsBox
        count={allContacts.length}
        total={currentPageStat.totalContacts}
        title="Contacts shown"
      />

      <Box
        width="lg"
        height="md"
        // borderWidth="1px"
        // borderColor="whatsapp.800"
        borderRadius="md"
        marginY="3"
        overflowY="auto"
        display="flex"
        flexDirection="column"
        gap="0.5em"
        padding="2"
        bg="blackAlpha.300"
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
            />
          </Tooltip>
        )}
        {/* <Text fontWeight="bold" color="gray.700">
          Contacts in whatsapp's database
        </Text>
        {allContacts.map((contact) => {
          if (contact.contactName == "unavailable")
            return <ContactCard key={contact.contactId} contact={contact} />;
        })} */}
      </Box>

      {/* <Button
        isLoading={loading}
        colorScheme="whatsapp"
        onClick={() =>
          downloadFile(
            allContacts,
            `AllContacts_${new Intl.DateTimeFormat(
              "en-US"
            ).format()}_${Math.floor(Math.random() * 420)}.xlsx`
          )
        }
      >
        Download Results
      </Button> */}
    </>
  );
}
