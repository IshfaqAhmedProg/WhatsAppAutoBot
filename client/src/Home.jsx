import { Box, Button, Image, Input, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WhatsAppQRCode from "./components/WhatsAppQRCode";
import "./index.css";

export default function Home({ socket }) {
  const navigate = useNavigate();
  const [allClient, setAllClient] = useState();
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);
  const clientSet = useRef(false);
  const clientReady = useRef(false);
  const [clientData, setServerData] = useState({
    id: "",
    name: "",
  });
  const toast = useToast();
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
    const id = clientData.id;
    console.log({ id: id, name: clientData.name });
    socket.emit("set_client", { id: id, name: clientData.name });
  }
  useEffect(() => {
    socket.on("recieve_message", (data) => {
      if (clientSet.current) return;
      clientSet.current = true;
      toast({
        title: data,
        description:
          "If new client is detected, QR will be generated or else you'll be logged in.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    });
  }, [socket]);
  useEffect(() => {
    socket.on("qr_generated", (qr) => {
      setLoading(false);
      setQr(qr);
    });
  }, [socket]);
  useEffect(() => {
    socket.on("client_ready", (data) => {
      toast({
        title: data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/menu", { state: { id: data.id, name: data.name } });
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
      <Link to="https://github.com/IshfaqAhmedProg" target="_blank">
        <Image
          src="/WhatsappBotLogo.png"
          alt="Logo"
          boxSize="200px"
          objectFit="cover"
        />
      </Link>
      {!qr ? (
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
            <Text color="whatsapp.300">Enter client name</Text>
            <Input
              isRequired={true}
              maxWidth="xs"
              bg="gray.700"
              borderColor="whatsapp.800"
              placeholder="Enter name here"
              type="text"
              onChange={(e) => {
                setServerData({
                  ...clientData,
                  id: create_UUID(),
                  name: e.target.value,
                });
              }}
              value={clientData.name}
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
                      isDisabled={loading}
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
                          ...clientData,
                          id: client.id,
                          name: client.name,
                        });
                      }}
                    >
                      <Text fontSize="md" fontWeight="bold">
                        {client.name}
                      </Text>
                      <Text fontWeight="light">#{client.id}</Text>
                    </Button>
                  );
                })
              )}
            </Box>
          </form>
        </>
      ) : (
        <WhatsAppQRCode qr={qr} />
      )}
      {console.log(clientData)}
    </Box>
  );
}
