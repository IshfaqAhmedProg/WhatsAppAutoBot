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
import { utils, writeFile } from "sheetjs-style-v2";
import ContactCard from "../components/ContactCard";
import StatsBox from "../components/StatsBox";
import { downloadFile } from "../Functions/downloadFile";
import { FiArrowDown } from "react-icons/fi";
export default function AllContacts({ socket }) {
  const itemsPerPage = 2;
  const [loading, setLoading] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [contactsStat, setContactsStat] = useState({
    totalContacts: 0,
    totalWhatsAppContacts: 0,
  });
  const [currentPageStat, setCurrentPageStat] = useState({
    page: 1,
    totalPages: 0,
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
      setAllContacts((allContacts) => [
        ...new Set([...allContacts, ...data.items]),
      ]);
      const whatsappcontacts = data.items.filter((contact) => {
        return contact.contactIsWAContact === true;
      });
      console.log("whatsappcontacts", whatsappcontacts);
      setContactsStat((current) => ({
        totalContacts: current.totalContacts + data.items.length,
        totalWhatsAppContacts:
          current.totalWhatsAppContacts + whatsappcontacts.length,
      }));
      setCurrentPageStat({
        page: data.page,
        totalPages: data.totalPages,
      });
      setLoading(false);
    });
  }, [socket, allContacts, currentPageStat]);

  return (
    <>
      <Heading color="gray.700">All Contacts</Heading>
      {console.log("allContacts", allContacts)}
      <StatsBox
        count={contactsStat.totalContacts}
        total={contactsStat.totalWhatsAppContacts}
        title="WhatsApp Contacts"
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

      <Button
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
      </Button>
    </>
  );
}
