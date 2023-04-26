import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./Home";
import Menu from "./pages/Menu";
import { Box, Image, Stack, Text, useToast } from "@chakra-ui/react";
import CreateValidationTask from "./pages/CreateValidationTask";
import FeaturesLayout from "./components/FeaturesLayout";
import { TbCircleDotFilled } from "react-icons/tb";
import AllContacts from "./pages/AllContacts";
import ValidateNumbers from "./pages/ValidateNumbers";
import ValidationResult from "./pages/ValidationResult";
import SelectContacts from "./components/SelectContacts";
import { useClient } from "./contexts/ClientContext";
import packageJSON from "../package.json";
import ComposeMessage from "./pages/ComposeMessage";
export default function App() {
  const { socket, serverConnection, handleConnect, handleDisconnect } =
    useClient();
  const toast = useToast();
  const shouldSetVersion = useRef(true);
  const [serverVersion, setServerVersion] = useState("0.0.0");
  useEffect(() => {
    socket.on("connect", () => {
      handleConnect();
    });
    socket.on("connected", () => {
      handleConnect();
    });
    socket.on("disconnected", () => {
      handleDisconnect();
    });
    socket.on("disconnect", () => {
      handleDisconnect();
    });
  }, [socket]);
  useEffect(() => {
    socket.on("server_version", (version) => {
      if (shouldSetVersion.current) {
        console.log("version", version);
        setServerVersion(version);
        if (version != packageJSON.version) {
          toast({
            title: "Outdated Server",
            description: `Update to the latest server by downloading the server files from the link below.`,
            status: "error",
            duration: 99999,
            isClosable: false,
          });
        }
        shouldSetVersion.current = false;
      }
    });
  }, [socket]);

  return (
    <>
      <Stack position="absolute" top="5%" right="5%" color="whiteAlpha.300">
        <Box fontSize="sm" display="flex" alignItems="center" gap="2">
          <Text>
            {serverConnection ? "Connected to Server" : "Server Disconnected"}
          </Text>
          <TbCircleDotFilled
            style={{
              color: serverConnection
                ? "var(--chakra-colors-whatsapp-500)"
                : "var(--chakra-colors-red-500)",
            }}
          />
        </Box>
        {serverConnection && (
          <Box lineHeight="1">
            <Text textAlign="right" fontSize="sm">
              Current server version:
            </Text>
            <Text
              textAlign="right"
              fontWeight="bold"
              color={
                serverVersion < packageJSON.version ? "red.500" : "whatsapp.500"
              }
            >
              v{serverVersion}
            </Text>
          </Box>
        )}
      </Stack>

      <Box
        borderRadius="lg"
        overflow="hidden"
        padding="8.5em 2em 2em 2em"
        marginInline="auto"
        width="70%"
        maxW="container.md"
        height="80%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        bg="gray.900"
        position="relative"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route element={<FeaturesLayout />}>
            <Route
              path="/createValidationTask"
              element={<CreateValidationTask />}
            />

            <Route path="/validateNumbers">
              <Route index element={<ValidateNumbers />} />
              <Route path=":taskId" element={<ValidationResult />} />
            </Route>

            <Route path="/allContacts" element={<AllContacts />} />
            <Route path="/sendBulkMessages">
              <Route index element={<ComposeMessage />} />
              <Route path=":sendType" element={<SelectContacts />} />
            </Route>
          </Route>
        </Routes>
      </Box>
    </>
  );
}
