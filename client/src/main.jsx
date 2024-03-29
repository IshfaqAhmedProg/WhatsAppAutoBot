import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";
import { ClientContextProvider } from "./contexts/ClientContext";
const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: "",
      },
    }),
  },
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <ClientContextProvider>
          <App />
        </ClientContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
