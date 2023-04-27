import {
  Box,
  Card,
  CardBody,
  Checkbox,
  Image,
  Progress,
  Skeleton,
  Stack,
  Tag,
  TagLabel,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { parsePhoneNumber } from "libphonenumber-js";
import React from "react";
import { BiUserCircle } from "react-icons/bi";

export default function ContactCard({
  contact,
  isLoading = false,
  isSelectable = false,
  progressBar = false,
  progress = 0,
}) {
  const formattedNumber = parsePhoneNumber(
    `+${contact.contactNumber}`
  ).formatInternational();
  return (
    <Card bg="gray.800" position="relative">
      {/* {console.log(progress)} */}
      {progressBar && (
        <Progress
          size="xs"
          colorScheme="whatsapp"
          value={progress}
          hasStripe
          borderRadius="xl"
          isIndeterminate={progress == 0 ? true : false}
          bg="gray.900"
        />
      )}
      <Skeleton isLoaded={!isLoading}>
        <CardBody display="flex" gap="3">
          {isSelectable && (
            <Checkbox colorScheme="whatsapp" value={contact.contactChatId} />
          )}
          {contact.contactProfilePicUrl ? (
            <Image
              src={contact.contactProfilePicUrl}
              boxSize="50px"
              borderRadius="50%"
            />
          ) : (
            <BiUserCircle size="50px" color="var(--chakra-colors-gray-600)" />
          )}
          <Box>
            <Stack direction="row" color="whiteAlpha.800">
              <Tooltip label={contact.contactName}>
                <Text fontWeight="bold" fontSize="md" noOfLines={1} maxW="3xs">
                  {contact.contactName}
                </Text>
              </Tooltip>
              <Text color="whiteAlpha.500" fontSize="md">
                {contact.contactPushName}
              </Text>
            </Stack>

            {contact.contactIsWAContact && (
              <Tag
                position="absolute"
                top="15%"
                right="3%"
                variant="outline"
                colorScheme={contact.contactIsWAContact ? "whatsapp" : "red"}
              >
                <TagLabel>
                  {contact.contactIsWAContact ? "Valid" : "Invalid"}
                </TagLabel>
              </Tag>
            )}
            <Text color="whiteAlpha.800" fontSize="md">
              {formattedNumber}
            </Text>
          </Box>
        </CardBody>
      </Skeleton>
    </Card>
  );
}
