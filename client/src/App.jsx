import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./index.css";
import Home from "./Home";
import Menu from "./pages/Menu";
import { io } from "socket.io-client";
import { Box, Image, Text, useToast } from "@chakra-ui/react";
import CreateVCard from "./pages/CreateVCard";
import { ClientContextProvider } from "./contexts/clientContext";
import FeaturesLayout from "./components/FeaturesLayout";
import SendBulkMessages from "./pages/SendBulkMessages";
import { TbCircleDotFilled } from "react-icons/tb";
import AllContacts from "./pages/AllContacts";
import ValidateNumbers from "./pages/ValidateNumbers";
const socket = io.connect("http://localhost:5000");

export default function App() {
  const navigate = useNavigate();
  const toast = useToast();
  const [serverConnection, setServerConnection] = useState(false);
  useEffect(() => {
    socket.on("connect", () => {
      setServerConnection(true);
    });
    socket.on("connected", () => {
      setServerConnection(true);
    });
    socket.on("disconnected", () => {
      setServerConnection(false);
      navigate("/");
    });
    socket.on("disconnect", () => {
      toast({
        title: "Server Error",
        description: `You've been disconnected from the server.`,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
      setServerConnection(false);
      navigate("/");
    });
  }, [socket]);
  return (
    <ClientContextProvider>
      <Box
        position="absolute"
        top="5%"
        right="5%"
        color="whiteAlpha.300"
        fontSize="sm"
        display="flex"
        alignItems="center"
        gap="2"
      >
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
      <Box
        borderRadius="lg"
        overflow="hidden"
        padding="2em"
        marginInline="auto"
        width="70%"
        maxW="3xl"
        height="80%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        bg="gray.900"
        position="relative"
      >
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/menu" element={<Menu socket={socket} />} />
          <Route element={<FeaturesLayout />}>
            <Route
              path="/createVCard"
              element={<CreateVCard socket={socket} />}
            />
            <Route
              path="/validateNumbers"
              element={<ValidateNumbers socket={socket} />}
            />
            <Route
              path="/allContacts"
              element={<AllContacts socket={socket} />}
            />
            <Route
              path="/sendMessage"
              element={<SendBulkMessages socket={socket} />}
            />
          </Route>
        </Routes>
      </Box>
    </ClientContextProvider>
  );
}
