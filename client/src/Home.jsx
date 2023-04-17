import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WhatsAppQRCode from "./components/WhatsAppQRCode";
import { useClient } from "./contexts/ClientContext";
import { create_UUID } from "./Functions/createUUID";
import "./index.css";
import { TbTrashXFilled } from "react-icons/tb";
import { FiLogIn } from "react-icons/fi";

export default function Home({ socket }) {
  const { registerClient } = useClient();
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

  function handleNewClientForm(e) {
    e.preventDefault();
    setLoading(true);
    console.log({ id: clientData.id, name: clientData.name });
    socket.emit("set_client", { id: clientData.id, name: clientData.name });
  }
  function deleteClient(clientId) {
    console.log(clientId);
    setLoading(true);
    socket.emit("delete_client", { clientId: clientId });
  }
  useEffect(() => {
    socket.on("disconnect", () => {
      setLoading(false);
    });
  }, [socket]);
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
        duration: 2000,
        isClosable: true,
      });
      registerClient(data.id, data.name);
      navigate("/menu");
    });
  }, [socket]);
  useEffect(() => {
    socket.on("all_clients", (data) => {
      setAllClient(data);
      console.log(data);
    });
  }, [socket]);
  useEffect(() => {
    socket.on("client_deleted", () => {
      setLoading(false);
      toast({
        title: "Client deleted!",
        status: "success",
        duration: 2000,
        isClosable: false,
      });
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
      <Link
        to="https://drive.google.com/drive/folders/1OIeX8n5MnivBv0c5G6mNwAwy8eAYwI2A?usp=sharing"
        target="_blank"
      >
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
            <Stack direction="row" alignItems="flex-end">
              <FormControl>
                <FormLabel color="whatsapp.300">Enter client name</FormLabel>
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
              </FormControl>
              <Button type="submit" isLoading={loading} colorScheme="whatsapp">
                Submit
              </Button>
            </Stack>
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
                    <Card key={client.id} width="full" bg="blackAlpha.600">
                      <CardBody
                        display="flex"
                        justifyContent="space-between"
                        size="lg"
                        minHeight="3rem"
                      >
                        <Box>
                          <Text
                            fontSize="md"
                            fontWeight="bold"
                            color="whiteAlpha.500"
                          >
                            {client.name}
                          </Text>
                          <Text fontWeight="light">#{client.id}</Text>
                        </Box>
                        <Stack direction="row">
                          <Tooltip label="Login to session">
                            <IconButton
                              icon={<FiLogIn />}
                              colorScheme="blackAlpha"
                              color="whiteAlpha.600"
                              _hover={{
                                borderColor: "whatsapp.500",
                                color: "whatsapp.500",
                              }}
                              type="submit"
                              onClick={() => {
                                setServerData({
                                  ...clientData,
                                  id: client.id,
                                  name: client.name,
                                });
                              }}
                            />
                          </Tooltip>
                          <Tooltip label="Delete the client?">
                            <IconButton
                              icon={<TbTrashXFilled />}
                              colorScheme="blackAlpha"
                              color="whiteAlpha.600"
                              _hover={{
                                borderColor: "red.500",
                                color: "red.500",
                              }}
                              onClick={() => deleteClient(client.id)}
                              type="button"
                            />
                          </Tooltip>
                        </Stack>
                      </CardBody>
                    </Card>
                  );
                })
              )}
            </Box>
          </form>
        </>
      ) : (
        <WhatsAppQRCode qr={qr} />
      )}
    </Box>
  );
}
