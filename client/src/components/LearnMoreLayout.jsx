import React from "react";
import { Box } from "@chakra-ui/react";
import PageTitle from "./PageTitle";
import { Outlet } from "react-router-dom";
import { Paragraph, SubSection, TextLink } from "./DocumentationComponents";

export default function LearnMoreLayout() {
  return (
    <>
      <PageTitle>Learn more</PageTitle>
      <Box
        width="100%"
        height="100%"
        overflowY="auto"
        display="flex"
        flexDirection="column"
        borderRadius="md"
        bg="blackAlpha.400"
        px={5}
      >
        <Outlet />
        <SubSection header="Learn more">
          <Paragraph>
            <TextLink href="validation">1. How to validate numbers?</TextLink>
            <br />
            <TextLink href="automessage">
              2. How to automate sending messages?
            </TextLink>
          </Paragraph>
        </SubSection>
      </Box>
    </>
  );
}
