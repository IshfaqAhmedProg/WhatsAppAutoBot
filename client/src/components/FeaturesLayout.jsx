import { Button, Heading } from "@chakra-ui/react";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { BiArrowBack, BiMenu } from "react-icons/bi";

export default function FeaturesLayout({ title }) {
  return (
    <>
      <Link style={{ position: "absolute", left: "5%", top: "5%" }} to="/menu">
        <Button
          color="whiteAlpha.400"
          colorScheme="blackAlpha"
          leftIcon={<BiMenu />}
        >
          Menu
        </Button>
      </Link>
      <Outlet />
    </>
  );
}
