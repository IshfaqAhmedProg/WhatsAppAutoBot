import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiDownload, BiTrash } from "react-icons/bi";
import { Link } from "react-router-dom";
import { read, utils } from "xlsx";
import { uniqueKeys } from "../Functions/uniqueKeys";
import vCardsJS from "vcards-js";
import { isMobilePhone } from "validator";
import { create_UUID } from "../Functions/createUUID";
export default function CreateVCard({ socket }) {
  const [file, setFile] = useState();
  const [manualInput, setManualInput] = useState({
    name: "",
    number: "",
  });
  const toast = useToast();
  const [selectedHeaders, setSelectedHeaders] = useState({
    Numbers: "",
    Name: "",
    Email: "",
  });
  const [vCardOutput, setVCardOutput] = useState({
    ready: false,
    downloadUrl: "",
  });
  const requiredFields = ["Numbers", "Name"];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fileName: "",
    unformattedData: [],
    manualInputData: [],
    allColumnHeaders: [],
  });
  function handleFileConfirm() {
    const MAX_FILE_SIZE = 25 * 1024;
    const fileSizeInKb = file.size / 1024;
    if (fileSizeInKb < MAX_FILE_SIZE) {
      const processFile = new Promise((resolve, reject) => {
        setLoading(true);
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const workbook = read(bufferArray, { type: "buffer", raw: true });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const sheetdata = utils.sheet_to_json(worksheet);
          resolve(sheetdata);
        };
        fileReader.onerror = (err) => {
          console.log(err);
          resolve(err);
        };
      });
      processFile
        .then((data) => {
          setLoading(false);
          console.log("data", data);
          setFormData((formData) => ({ ...formData, unformattedData: data }));
          //get the unique headers that the file contains
          const uniqueHeaders = uniqueKeys(data);
          setFormData((formData) => ({
            ...formData,
            allColumnHeaders: uniqueHeaders,
            fileName: file.name,
          }));
        })
        .catch((err) => {
          toast({
            title: "Error",
            description:
              "If new client is detected, QR will be generated or else you'll be logged in.",
            status: "error",
            duration: 5000,
            isClosable: false,
          });
          console.log(err);
        });
    } else {
      toast({
        title: "Error",
        description: `Max file size ${MAX_FILE_SIZE / 1024} mb`,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  }
  function handleCreateVCard(e) {
    e.preventDefault();

    var mainString = "";
    const taskObject = { id: create_UUID(), data: [] };

    formData.unformattedData.forEach((contact) => {
      var vCard = vCardsJS();
      vCard.firstName = contact[selectedHeaders.Name];
      vCard.workPhone = contact[selectedHeaders.Numbers];
      vCard.email = contact[selectedHeaders.Email];
      mainString = mainString + vCard.getFormattedString();
      taskObject.data.push({
        id: create_UUID(),
        name: contact[selectedHeaders.Name],
        number: contact[selectedHeaders.Numbers],
        email: contact[selectedHeaders.Email],
      });
      console.log("mainString", mainString);
    });
    socket.emit("create_task", taskObject);
    console.log("mainString final", mainString);
    var vCardBlob = new Blob([mainString], { type: "text/vcard" });
    var vCardURL = window.URL.createObjectURL(vCardBlob);
    setVCardOutput({ ready: true, downloadUrl: vCardURL });
  }
  function handleCreateVCardManual() {
    var mainString = "";
    const taskObject = { id: create_UUID(), data: [] };

    formData.manualInputData.forEach((contact) => {
      var vCard = vCardsJS();
      vCard.firstName = contact.name;
      vCard.workPhone = contact.number;
      mainString = mainString + vCard.getFormattedString();
      taskObject.data.push({
        name: contact.name,
        number: contact.number,
      });
      console.log("mainString", mainString);
    });

    socket.emit("create_task", taskObject);

    console.log("mainString final", mainString);
    var vCardBlob = new Blob([mainString], { type: "text/vcard" });
    var vCardURL = window.URL.createObjectURL(vCardBlob);

    setVCardOutput({ ready: true, downloadUrl: vCardURL });
  }
  function validateManualInput() {
    const numberValid = isMobilePhone(manualInput.number);
    if (numberValid) {
      setFormData({
        ...formData,
        manualInputData: [...formData.manualInputData, manualInput],
      });
      setManualInput({ name: "", number: "" });
    } else {
      toast({
        title: "Error",
        description: `Phone number not recognized!`,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  }
  return (
    <>
      <Heading color="gray.700">
        Create vCard file {"("}.vcf{")"}
      </Heading>
      {!vCardOutput.ready ? ( //if column headers approved
        <form onSubmit={handleCreateVCard} style={{ height: "80%" }}>
          {!formData.fileName ? ( //if file not approved show initial screen
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="1.5em"
            >
              {!file ? ( //if file not found show upload button
                <>
                  <Stack color="whatsapp.700" position="relative">
                    <Text fontWeight="bold" color="whatsapp.500">
                      Input manually
                    </Text>
                    {formData.manualInputData.length != 0 && (
                      <Stack
                        direction="row"
                        position="absolute"
                        top="-8%"
                        right="2%"
                      >
                        <Button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, manualInputData: [] });
                          }}
                          leftIcon={<BiTrash />}
                          colorScheme="blackAlpha"
                          color="whiteAlpha.600"
                        >
                          Clear
                        </Button>
                        <Button
                          colorScheme="whatsapp"
                          type="button"
                          onClick={handleCreateVCardManual}
                        >
                          Confirm
                        </Button>
                      </Stack>
                    )}
                    <Stack
                      bg="blackAlpha.500"
                      minH="3xs"
                      maxH="xs"
                      overflowY="auto"
                      borderRadius="md"
                      padding="2"
                    >
                      {formData.manualInputData.map((data) => {
                        return (
                          <Box
                            key={data.number}
                            borderRadius="sm"
                            width="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            padding="4"
                            bg="gray.800"
                          >
                            <Text fontWeight="bold">{data.name}</Text>
                            <Text>{data.number}</Text>
                          </Box>
                        );
                      })}
                    </Stack>
                    <Stack direction="row" alignItems="flex-end">
                      <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                          type="text"
                          borderColor="whatsapp.700"
                          color="whatsapp.500"
                          value={manualInput.name}
                          onChange={(e) => {
                            setManualInput({
                              ...manualInput,
                              name: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          type="text"
                          borderColor="whatsapp.700"
                          color="whatsapp.500"
                          value={manualInput.number}
                          onChange={(e) => {
                            setManualInput({
                              ...manualInput,
                              number: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                      <Button
                        colorScheme="blackAlpha"
                        color="whatsapp.500"
                        type="button"
                        onClick={validateManualInput}
                      >
                        Add
                      </Button>
                    </Stack>
                  </Stack>
                  {formData.manualInputData.length == 0 && ( //if no manual input then show upload file button
                    <>
                      <Divider borderColor="whatsapp.800" />
                      <Text
                        maxW="sm"
                        color="whatsapp.500"
                        textAlign="center"
                        fontSize="sm"
                      >
                        Upload your XLSX or CSV files containing the numbers.
                        Make sure to have <strong>atleast two columns</strong>,
                        one containing the <strong>numbers</strong> and the
                        other containing some form of{" "}
                        <strong>identifier</strong> like email, name etc.
                      </Text>
                      <FormLabel
                        htmlFor="fileinput"
                        bg="whatsapp.500"
                        borderRadius="sm"
                        padding="2"
                        color="whatsapp.800"
                        fontWeight="bold"
                        cursor="pointer"
                        maxWidth="100px"
                      >
                        upload file
                      </FormLabel>
                    </>
                  )}
                </>
              ) : (
                <Text color="white">{file.name}</Text>
              )}
              <Input
                type="file"
                id="fileinput"
                name="fileinput"
                hidden
                accept=".csv,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              {file && (
                <Box display="flex" gap="8">
                  <Button
                    type="button"
                    colorScheme="whatsapp"
                    onClick={handleFileConfirm}
                  >
                    Confirm
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setFile("");
                    }}
                    variant="outlined"
                    color="whatsapp.500"
                    colorScheme="whatsapp"
                  >
                    Change File
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Box
              width="sm"
              display="flex"
              flexDirection="column"
              gap="1em"
              alignItems="center"
            >
              {Object.keys(selectedHeaders).map((key) => {
                return (
                  <FormControl
                    key={key}
                    isRequired={requiredFields.includes(key)}
                  >
                    <FormLabel color="whatsapp.600">
                      Select the field for {key}
                    </FormLabel>
                    <Select
                      value={selectedHeaders[key]}
                      placeholder={key}
                      color="whatsapp.500"
                      bg="blackAlpha.500"
                      variant="filled"
                      colorScheme="blackAlpha"
                      onChange={(e) => {
                        setSelectedHeaders({
                          ...selectedHeaders,
                          [key]: e.target.value,
                        });
                      }}
                    >
                      {formData.allColumnHeaders.map((headers) => {
                        return (
                          <option
                            style={{
                              color: "var(--chakra-colors-whatsapp-800)",
                            }}
                            key={headers}
                          >
                            {headers}
                          </option>
                        );
                      })}
                    </Select>
                  </FormControl>
                );
              })}

              <Button
                type="submit"
                colorScheme="whatsapp"
                width="120px"
                marginTop="3rem"
              >
                Create vCard
              </Button>
            </Box>
          )}
        </form>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="2.5em"
        >
          <Text color="whatsapp.600" textAlign="center" maxW="sm">
            Now you can download the file and upload it to the contacts of the
            device that whatsapp is registered in.
          </Text>
          <Link to={vCardOutput.downloadUrl} target="_blank">
            <Button colorScheme="whatsapp" rightIcon={<BiDownload />}>
              Download vCard
            </Button>
          </Link>
        </Box>
      )}
    </>
  );
}
