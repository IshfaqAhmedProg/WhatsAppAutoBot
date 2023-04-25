import { Box, Button } from "@chakra-ui/react";
import React from "react";
import PageTitle from "../components/PageTitle";

export default function ComposeMessage() {
  return (
    <>
      <PageTitle>Send Bulk Message</PageTitle>
      <Box borderRadius="lg" width="90%" height="90%" bg="blackAlpha.600"></Box>
      <Button colorScheme="whatsapp">Select Contacts</Button>
    </>
  );
}
