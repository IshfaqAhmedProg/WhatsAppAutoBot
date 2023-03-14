import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  Image,
  Stack,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { RxSlash } from "react-icons/rx";
import { utils, writeFile } from "sheetjs-style-v2";
import ContactCard from "../components/ContactCard";
import StatsBox from "../components/StatsBox";
import { downloadFile } from "../Functions/downloadFile";
export default function AllContacts({ socket }) {
  const [loading, setLoading] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [contactsStat, setContactsStat] = useState({
    totalContacts: 0,
    totalWhatsAppContacts: 0,
  });
  function getAllContactsProfilePic() {
    setLoading(true);
    socket.emit("get_all_contacts", { profilePicUrl: true });
  }

  useEffect(() => {
    socket.on("set_all_contacts", (data) => {
      setAllContacts(data);
      const whatsappcontacts = data.filter((contact) => {
        return contact.contactIsWAContact === true;
      });
      console.log("whatsappcontacts", whatsappcontacts);
      setContactsStat({
        totalContacts: data.length,
        totalWhatsAppContacts: whatsappcontacts.length,
      });
      setLoading(false);
    });
  }, [socket]);
  useEffect(() => {
    socket.emit("get_all_contacts", { profilePicUrl: false });
  }, []);

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
          if (contact.contactName != "unavailable")
            return <ContactCard key={contact.contactId} contact={contact} />;
        })}
        <Text fontWeight="bold" color="gray.700">
          Contacts in whatsapp's database
        </Text>
        {allContacts.map((contact) => {
          if (contact.contactName == "unavailable")
            return <ContactCard key={contact.contactId} contact={contact} />;
        })}
      </Box>
      <Button
        isLoading={loading}
        colorScheme="blackAlpha"
        onClick={getAllContactsProfilePic}
      >
        Get Profile Pictures
      </Button>
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
