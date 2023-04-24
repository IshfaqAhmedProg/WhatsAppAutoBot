import { Box, Button, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { downloadFile } from "../Functions/downloadFile";
import { useClient } from "../contexts/ClientContext";

export default function ValidationResult() {
  const { socket } = useClient();
  const taskId = useParams().taskId;
  const [loading, setLoading] = useState(false);
  const [taskResults, setTaskResults] = useState([]);

  useEffect(() => {
    socket.on("task_results", (results) => {
      setTaskResults(results);
      setLoading(false);
    });
  }, [socket]);
  useEffect(() => {
    socket.emit("get_task_results", taskId);
    setLoading(true);
  }, []);
  return (
    <Stack alignItems="center">
      <Text color="whatsapp.600" maxW="sm" textAlign="center">
        Make sure you <strong>uploaded</strong> the vCard to the whatsapp device
        and <strong>imported</strong> the contacts.
      </Text>
      <Button
        onClick={() =>
          downloadFile(
            taskResults,
            `Validation Results_${new Intl.DateTimeFormat(
              "en-US"
            ).format()}_${Math.floor(Math.random() * 420)}.xlsx`
          )
        }
        isLoading={loading}
        maxW="fit-content"
      >
        Download
      </Button>
    </Stack>
  );
}
