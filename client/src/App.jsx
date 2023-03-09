import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./Home";
import Menu from "./pages/Menu";
import { io } from "socket.io-client";
import { Box, Image } from "@chakra-ui/react";
import CreateVCard from "./pages/CreateVCard";
const socket = io.connect("http://localhost:5000");

export default function App() {
  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      padding="2em"
      marginInline="auto"
      width="70%"
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
        <Route path="/createVCard" element={<CreateVCard socket={socket} />} />
        <Route
          path="/validateContacts"
          element={<CreateVCard socket={socket} />}
        />
        <Route
          path="/getContactData"
          element={<CreateVCard socket={socket} />}
        />
        <Route path="/sendMessage" element={<CreateVCard socket={socket} />} />
      </Routes>
    </Box>
  );
}
