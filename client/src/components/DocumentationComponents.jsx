import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
export function Header({ children }) {
  return (
    <Heading color="gray.600" fontSize="2xl" px={1} mb={2} mt={4}>
      {children}
    </Heading>
  );
}
export function SubHeader({ children }) {
  return (
    <Heading color="gray.600" fontSize="lg" px={2} mt={5}>
      {children}
    </Heading>
  );
}
export function Paragraph(props) {
  return (
    <Text
      color={"whiteAlpha.800"}
      sx={{
        "& strong.title": { color: "whatsapp.700" },
        "& a": { fontWeight: "bold" },
      }}
      mt={1}
      mb={4}
      pl={4}
      lineHeight={6}
      {...props}
    >
      {props.children}
    </Text>
  );
}
export function CompactParagraph(props) {
  return (
    <Text
      color={"whiteAlpha.800"}
      sx={{
        "& strong.title": { color: "whatsapp.700" },
        "& a": { fontWeight: "bold" },
      }}
      mt={3}
      fontSize={"sm"}
      {...props}
    >
      {props.children}
    </Text>
  );
}
export function SubSection(props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      borderRadius="md"
      bg="blackAlpha.400"
      padding={3}
      my={4}
    >
      <Heading color="gray.700" fontSize="lg" px={2} mb={2}>
        {props.header}
      </Heading>
      {props.children}
    </Box>
  );
}
export function Images(props) {
  const [enlarged, setEnlarged] = useState(false);
  return (
    <>
      <Stack
        alignItems={"center"}
        my={2}
        onClick={() => setEnlarged(!enlarged)}
      >
        <Image
          {...props}
          borderRadius={"md"}
          border={"3px solid var(--chakra-colors-whiteAlpha-200)"}
        />
      </Stack>

      {enlarged && (
        <>
          <div
            style={{
              background: "black",
              opacity: "0.8",
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
            }}
            onClick={() => setEnlarged(!enlarged)}
          ></div>
          <Stack
            position="absolute"
            top={"50%"}
            left={"50%"}
            width={"80%"}
            height={"100%"}
            transform={"translate(-50%,-40%)"}
            onClick={() => setEnlarged(!enlarged)}
          >
            <Image src={props?.src} alt={props?.alt} borderRadius={"md"} />
          </Stack>
        </>
      )}
    </>
  );
}
export function TextLink(props) {
  return <Link to={props.href}>{props.children ?? props.href}</Link>;
}
export function BulletPoint(props) {
  return <>&#x25cf; {props.children}</>;
}
