import { Button } from "@chakra-ui/react";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <>
      <Button
        color="gray.700"
        colorScheme="blackAlpha"
        leftIcon={<BiArrowBack />}
        position="absolute"
        left="5%"
        top="5%"
        onClick={() => navigate(-1)}
        size={"sm"}
      >
        Back
      </Button>
      <Outlet />
    </>
  );
}
