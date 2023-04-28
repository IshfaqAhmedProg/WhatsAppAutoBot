import {
  Box,
  Card,
  CardBody,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";

export default function ListCard({ buttons, id, stats, datetime }) {
  return (
    <Card bg="gray.800" borderRadius="md" color="whiteAlpha.800" width="100%">
      <CardBody display="flex" direction="row" justifyContent="space-between">
        <Stack>
          <Text fontWeight="bold" fontSize="lg" color="whatsapp.400">
            #
            <span style={{ color: "var(--chakra-colors-whiteAlpha-800)" }}>
              {id}
            </span>
          </Text>
          <Text color="whatsapp.700" fontSize="sm">
            {datetime}
          </Text>
        </Stack>
        <Stack alignItems="flex-end">
          <Text color="whiteAlpha.400" fontSize="xs">
            {stats}
          </Text>
          <Stack direction="row">{buttons}</Stack>
        </Stack>
      </CardBody>
    </Card>
  );
}
