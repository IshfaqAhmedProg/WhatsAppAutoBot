import { Box, Button, Image, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import AlertComponent from "./components/Alert";
import "./index.css";

export default function Home({ socket }) {
  const navigate = useNavigate();
  const [allClient, setAllClient] = useState();
  const [loading, setLoading] = useState(false);
  const [serverData, setServerData] = useState({
    id: "",
    name: "",
    qr: "",
    message: "",
  });
  function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxyxxxxx".replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }
  function handleNewClientForm(e) {
    e.preventDefault();
    setLoading(true);
    const id = serverData.id || create_UUID();
    console.log({ id: id, name: serverData.name });
    socket.emit("set_client", { id: id, name: serverData.name });
  }

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setServerData({ ...serverData, message: data });
    });
  }, [socket]);
  useEffect(() => {
    socket.on("qr_generated", (qr) => {
      setLoading(false);
      setServerData({ ...serverData, qr: qr });
    });
  }, [socket]);
  useEffect(() => {
    socket.on("client_ready", (data) => {
      setServerData({ ...serverData, message: data });
      navigate("menu", { replace: false });
    });
  }, [socket]);
  useEffect(() => {
    socket.on("all_clients", (data) => {
      setAllClient(data);
      console.log(data);
    });
  }, [socket]);
  return (
    <Box
      paddingBlock="3"
      display="flex"
      flexDirection="column"
      gap="1rem"
      color="white"
      alignItems="center"
      position="relative"
    >
      <Image
        src="/WhatsappBotLogo.png"
        alt="Logo"
        boxSize="200px"
        objectFit="cover"
      />
      {!serverData.qr ? (
        <>
          <form
            onSubmit={handleNewClientForm}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1em",
              alignItems: "center",
            }}
          >
            Enter client name
            <Input
              maxWidth="xs"
              bg="gray.700"
              borderColor="whatsapp.800"
              placeholder="Enter name here"
              type="text"
              onChange={(e) => {
                setServerData({ ...serverData, name: e.target.value });
              }}
            />
            <Button
              type="submit"
              isLoading={loading}
              loadingText="Please Wait"
              colorScheme="whatsapp"
            >
              Submit
            </Button>
            <Box
              display="flex"
              flexDirection="column"
              gap="2"
              alignItems="center"
              borderWidth="1px"
              borderRadius="md"
              borderColor="whatsapp.800"
              minWidth="lg"
              height="xs"
              overflowY="auto"
              maxHeight="xs"
              padding="2"
            >
              {!allClient || allClient.length == 0 ? (
                <Text color="darkgray" fontWeight="bold">
                  No Clients found!
                </Text>
              ) : (
                allClient.map((client) => {
                  return (
                    <Button
                      disabled={loading}
                      type="submit"
                      key={client.id}
                      width="full"
                      colorScheme="blackAlpha"
                      display="flex"
                      justifyContent="space-between"
                      size="lg"
                      minHeight="3rem"
                      onClick={() => {
                        setServerData({
                          ...serverData,
                          id: client.id,
                          name: client.name,
                        });
                      }}
                    >
                      <Text fontWeight="light">#{client.id}</Text>
                      <Text>{client.name}</Text>
                    </Button>
                  );
                })
              )}
            </Box>
          </form>
        </>
      ) : (
        <Box
          borderColor="whatsapp.500"
          borderWidth="1px"
          borderRadius="md"
          padding="20"
          display="flex"
          flexDirection="column"
          gap="1rem"
          alignItems="center"
        >
          <Text fontWeight="bold" color="whatsapp.400">
            Scan the QR code
          </Text>
          <QRCode value={serverData.qr} />
        </Box>
      )}
      {serverData.message && <AlertComponent message={serverData.message} />}
    </Box>
  );
}
