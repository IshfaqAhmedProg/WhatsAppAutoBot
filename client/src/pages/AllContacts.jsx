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
  function downloadFile(filetype) {
    const headers = Object.keys(allContacts[0]);
    const aoaData = [[]];
    allContacts.map((obj) => {
      aoaData.push(Object.values(obj));
    });
    console.log("aoaData", aoaData);
    downloadFormatted(headers, aoaData, filetype);
  }
  function downloadFormatted(headerArray, data, fileType) {
    headerArray.forEach((header) => {
      data[0].push({
        v: `${header}`,
        t: "s",
        s: {
          font: { bold: true, color: { rgb: "FFFFFFFF" } },
          fill: { fgColor: { rgb: "FF7B68EE" } },
          border: {
            top: { style: "medium", color: { rgb: "FF7B68EE" } },
            bottom: { style: "medium", color: { rgb: "FF7B68EE" } },
            left: { style: "medium", color: { rgb: "FF7B68EE" } },
            right: { style: "medium", color: { rgb: "FF7B68EE" } },
          },
          alignment: { wrapText: true },
        },
      });
    });
    console.table("data", data);
    const worksheet = utils.aoa_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet);
    writeFile(
      workbook,
      `WhatsappValidationResult_${new Intl.DateTimeFormat("en-US").format(
        new Date(Date.now())
      )}_${Math.floor(Math.random() * 420)}.${fileType}`
    );
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
      <Box
        position="absolute"
        bottom="5%"
        right="5%"
        fontSize="xs"
        color="whiteAlpha.500"
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
      >
        <Box display="flex">
          <Text color="whatsapp.500" fontWeight="bold">
            {contactsStat.totalWhatsAppContacts}
          </Text>
          <RxSlash fontSize="18px" />
          <Text color="whiteAlpha.600" fontWeight="bold">
            {contactsStat.totalContacts}
          </Text>
        </Box>
        <Text>WhatsApp Contacts</Text>
      </Box>

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
        {allContacts.map((contact) => {
          return (
            <Card
              bg="blackAlpha.600"
              key={contact.contactId}
              position="relative"
            >
              <CardBody display="flex" gap="3">
                {contact.contactProfilePicUrl ? (
                  <Image
                    src={contact.contactProfilePicUrl}
                    boxSize="50px"
                    borderRadius="50%"
                  />
                ) : (
                  <BiUserCircle
                    size="50px"
                    color="var(--chakra-colors-whatsapp-800)"
                  />
                )}
                <Box>
                  <Stack direction="row" color="whiteAlpha.800">
                    <Text fontWeight="bold" fontSize="md">
                      {contact.contactName}
                    </Text>
                    <Text color="whiteAlpha.500" fontSize="md">
                      {contact.contactPushName}
                    </Text>
                  </Stack>
                  <Tag
                    position="absolute"
                    top="15%"
                    right="3%"
                    variant="outline"
                    colorScheme={
                      contact.contactIsWAContact ? "whatsapp" : "red"
                    }
                  >
                    <TagLabel>
                      {contact.contactIsWAContact ? "Valid" : "Invalid"}
                    </TagLabel>
                  </Tag>
                  <Text color="whiteAlpha.800" fontSize="md">
                    {contact.contactNumber}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          );
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
        onClick={() => downloadFile("xlsx")}
      >
        Download Results
      </Button>
    </>
  );
}
