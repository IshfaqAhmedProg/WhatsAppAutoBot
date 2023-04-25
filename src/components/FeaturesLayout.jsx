import { Button, Heading } from "@chakra-ui/react";
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

export default function FeaturesLayout({ title }) {
  const navigate = useNavigate();
  return (
    <>
      <Button
        color="whiteAlpha.400"
        colorScheme="blackAlpha"
        leftIcon={<BiArrowBack />}
        position="absolute"
        left="5%"
        top="5%"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <Outlet />
    </>
  );
}
