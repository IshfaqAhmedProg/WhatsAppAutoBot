import {
  Box,
  Button,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TbTrashXFilled } from "react-icons/tb";
import { MdContactPhone, MdTask } from "react-icons/md";
export default function ValidateNumbers({ socket }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allTasks, setAllTasks] = useState([]);
  const [commandToExecute, setCommandToExecute] = useState({
    command: "",
    message: "",
    taskId: "",
    confirm: false,
  });
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
  function deleteTask(taskId) {
    console.log({ commandToExecute });
    socket.emit("delete_task", taskId);
    setCommandToExecute({ command: "", message: "", confirm: false });
    socket.emit("get_tasks", "");
  }
  const ConfirmModal = ({ command, message }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{command}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{message}</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="whatsapp"
              onClick={() => {
                deleteTask(commandToExecute.taskId);
                onClose();
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  return (
    <>
      <ConfirmModal
        command={commandToExecute.command}
        message={commandToExecute.message}
      />
      <Heading color="gray.700">Validate Numbers</Heading>
      <Stack>
        <Text fontWeight="bold" color="whatsapp.500">
          All Tasks
        </Text>
        <Stack
          bg="blackAlpha.400"
          minH="xl"
          borderRadius="md"
          minW="xl"
          padding="2"
          overflowY="auto"
        >
          {allTasks.length == 0 && <Text color="whiteAlpha.500">No Tasks</Text>}
          {allTasks.map((task) => {
            return (
              <Stack
                key={task.id}
                bg="gray.800"
                borderRadius="md"
                color="whiteAlpha.800"
                padding="2"
                py="4"
                direction="row"
                justifyContent="space-between"
              >
                <Stack>
                  <Text fontWeight="bold" fontSize="lg" color="whatsapp.400">
                    #
                    <span
                      style={{ color: "var(--chakra-colors-whiteAlpha-800)" }}
                    >
                      {task.id}
                    </span>
                  </Text>
                  <Text color="whatsapp.700" fontSize="sm">
                    {task.createdAt}
                  </Text>
                </Stack>
                <Stack alignItems="flex-end">
                  <Text color="whiteAlpha.400" fontSize="xs">
                    <strong style={{ color: "whatsapp.400" }}>
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
                        onClick={() => {
                          setCommandToExecute({
                            ...commandToExecute,
                            command: "Delete",
                            taskId: task.id,
                            message: `Are you sure you want to delete task #${task.id}?`,
                          });
                          onOpen();
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Download vCard">
                      <IconButton
                        icon={<MdContactPhone />}
                        colorScheme="blackAlpha"
                        color="whiteAlpha.600"
                        _hover={{ color: "whatsapp.500" }}
                      />
                    </Tooltip>
                    <Tooltip label="View results">
                      <IconButton
                        icon={<MdTask />}
                        colorScheme="blackAlpha"
                        color="whatsapp.500"
                      />
                    </Tooltip>
                  </Stack>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </>
  );
}
