import { Box, Button } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Menu({ socket }) {
  const navigate = useNavigate();
  function changeClient() {
    socket.emit("log_out", "");
  }
  useEffect(() => {
    socket.on("logged_out", (data) => {
      if (data.loggedOut) {
        navigate("/", { reloadDocument: true });
      }
    });
  });
  return (
    <Box>
      <Button colorScheme="red" onClick={changeClient}>
        Change Client
      </Button>
    </Box>
  );
}
