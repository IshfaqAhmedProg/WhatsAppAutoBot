import React, { useContext, createContext, useState, useEffect } from "react";
const ClientContext = createContext({});
export const useClient = () => useContext(ClientContext);
export const ClientContextProvider = ({ children }) => {
  const [clientData, setClientData] = useState({});


  const registerClient = (id, name) => {
    setClientData({ id: id, name: name });
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    console.log("registering id:" + id + " name:" + name);
  };
  const removeClient = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    setClientData({ id: "", name: "" });
  };
  return (
    <ClientContext.Provider
      value={{ clientData, registerClient, removeClient }}
    >
      {children}
    </ClientContext.Provider>
  );
};
