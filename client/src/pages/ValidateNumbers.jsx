import {
  Box,
  Button,
  Heading,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TbTrashXFilled } from "react-icons/tb";
import { MdContactPhone, MdTask } from "react-icons/md";
export default function ValidateNumbers({ socket }) {
  const [allTasks, setAllTasks] = useState([]);
  useEffect(() => {
    socket.on("all_tasks", (data) => {
      const taskIds = Object.keys(data);
      const allTaskArray = taskIds.map((taskId) => {
        let taskObj = {
          id: taskId,
          createdAt: data[taskId].createdAt,
          length: data[taskId].length,
        };
        return taskObj;
      });
      setAllTasks(allTaskArray);
    });
  }, [socket]);
  useEffect(() => {
    socket.emit("get_all_contacts", { profilePicUrl: false });
    socket.emit("get_tasks", "");
  }, []);
  return (
    <>
      <Heading color="gray.700">Validate Numbers</Heading>
      <Stack
        bg="blackAlpha.400"
        minH="xl"
        borderRadius="md"
        minW="xl"
        padding="2"
        overflowY="auto"
      >
        {allTasks.map((task) => {
          return (
            <Stack
              key={task.id}
              bg="gray.800"
              borderRadius="md"
              color="whatsapp.500"
              padding="2"
              py="4"
              direction="row"
              justifyContent="space-between"
            >
              <Stack>
                <Text fontWeight="bold" fontSize="lg">
                  #{task.id}
                </Text>
                <Text color="whatsapp.700" fontSize="sm">
                  {task.createdAt}
                </Text>
              </Stack>
              <Stack alignItems="flex-end">
                <Text color="whiteAlpha.400" fontSize="xs">
                  <strong
                    style={{ color: "var(--chakra-colors-whatsapp-400)" }}
                  >
                    {task.length}
                  </strong>{" "}
                  {task.length > 1 ? "numbers" : "number"}
                </Text>
                <Stack direction="row">
                  <Tooltip label="Delete task">
                    <IconButton
                      icon={<TbTrashXFilled />}
                      colorScheme="blackAlpha"
                      color="whiteAlpha.600"
                      _hover={{ borderColor: "red.500", color: "red.500" }}
                    />
                  </Tooltip>
                  <Tooltip label="Create vCard">
                    <IconButton
                      icon={<MdContactPhone />}
                      colorScheme="blackAlpha"
                      color="whiteAlpha.600"
                      _hover={{ color: "whatsapp.500" }}
                    />
                  </Tooltip>
                  <Tooltip label="View results">
                    <IconButton icon={<MdTask />} colorScheme="whatsapp" />
                  </Tooltip>
                </Stack>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </>
  );
}
