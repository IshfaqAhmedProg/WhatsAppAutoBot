import { useToast } from "@chakra-ui/react";
import React, { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:5000");
const ClientContext = createContext({});

export const useClient = () => useContext(ClientContext);
export const ClientContextProvider = ({ children }) => {
  const [clientData, setClientData] = useState({});
  const [serverConnection, setServerConnection] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    if (!clientData.id) {
      socket.emit("log_out");
      navigate("/");
    }
  }, [clientData]);
  const registerClient = (id, name) => {
    setClientData({ id: id, name: name });
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    // console.log("registering id:" + id + " name:" + name);
  };
  const removeClient = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    setClientData({ id: "", name: "" });
  };

  function handleConnect() {
    setServerConnection(true);
  }
  function handleDisconnect() {
    if (!toast.isActive("disconnectFromServer")) {
      toast({
        id: "disconnectFromServer",
        title: "Server Error",
        description: `You've been disconnected from the server.`,
        status: "error",
        duration: 2000,
        isClosable: false,
      });
    }
    setServerConnection(false);
    removeClient();
    navigate("/");
  }
  return (
    <ClientContext.Provider
      value={{
        clientData,
        registerClient,
        removeClient,
        socket,
        serverConnection,
        handleDisconnect,
        handleConnect,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
