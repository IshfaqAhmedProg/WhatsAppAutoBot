import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiDownload } from "react-icons/bi";
import { TbTrashXFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import { read, utils } from "xlsx";
import { uniqueKeys } from "../functions/uniqueKeys";
import vCardsJS from "vcards-js";
import { isMobilePhone } from "validator";
import { create_UUID } from "../functions/createUUID";
import ContactCard from "../components/ContactCard";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { useClient } from "../contexts/ClientContext";
import PageTitle from "../components/PageTitle";

export default function CreateValidationTask() {
  const { socket } = useClient();
  const [file, setFile] = useState();
  const [manualInput, setManualInput] = useState({
    name: "",
    number: "",
  });
  const toast = useToast();
  const [selectedHeaders, setSelectedHeaders] = useState({
    Numbers: "",
    Name: "",
  });
  const [vCardOutput, setVCardOutput] = useState({
    ready: false,
    mainString: "",
    downloadUrl: "",
  });
  const requiredFields = ["Numbers", "Name"];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fileName: "",
    unformattedData: [],
    manualInputData: [],
    allColumnHeaders: [],
    keepInputFile: false,
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
          // console.log("data", data);
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
            description: "Error while processing file",
            status: "error",
            duration: 5000,
            isClosable: false,
          });
          // console.log(err);
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

  function handleCreateTaskFile(e) {
    e.preventDefault();
    setLoading(true);
    var mainString = "";
    const taskObject = { id: create_UUID(), data: [] };

    formData.unformattedData.forEach((contact) => {
      if (contact[selectedHeaders.Numbers] != ("" || undefined)) {
        console.log(contact[selectedHeaders.Numbers]);
        try {
          const name = contact[selectedHeaders.Name];
          const num = parsePhoneNumber(
            contact[selectedHeaders.Numbers].toString()
          );
          const number = num.format("E.164").replace("+", "");
          // console.log("number", number);
          if (isValidPhoneNumber("+" + number)) {
            var vCard = vCardsJS();
            vCard.firstName = name;
            vCard.workPhone = number;
            mainString = mainString + vCard.getFormattedString();
            const dataToPush = {
              queryName: name,
              queryNumber: number,
              unformattedNumber: contact[selectedHeaders.Numbers],
            };

            taskObject.data.push(dataToPush);

            // console.log("mainString", mainString);
          }
        } catch (error) {
          if (!toast.isActive("numberError")) {
            toast({
              id: "numberError",
              title: "Error",
              description: `Error in number ${
                contact[selectedHeaders.Numbers]
              }:${error}.`,
              status: "error",
              duration: 5000,
              isClosable: false,
            });
          }
        }
      }
    });
    if (taskObject.data.length != 0) {
      socket.emit(
        "create_task",
        {
          ...taskObject,
          file: formData.unformattedData,
        },
        (status) => {
          fileUploadedToast(status);
        }
      );
      setVCardOutput({ ...vCardOutput, mainString });
    } else {
      toast({
        title: "Error",
        description: `No numbers found`,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
    // console.log("formData.unformattedData", formData.unformattedData);
    // console.log("mainString final", mainString);
  }

  function handleCreateTaskManual() {
    var mainString = "";
    const taskObject = { id: create_UUID(), data: [] };

    formData.manualInputData.forEach((contact) => {
      var vCard = vCardsJS();
      vCard.firstName = contact.name;
      vCard.workPhone = contact.number;
      mainString = mainString + vCard.getFormattedString();
      const dataToPush = {
        queryName: contact.name,
        queryNumber: contact.number,
      };
      taskObject.data.push(dataToPush);
      // console.log("mainString", mainString);
    });

    socket.emit("create_task", taskObject, (status) => {
      fileUploadedToast(status);
    });
    setVCardOutput({ ...vCardOutput, mainString });
  }
  function fileUploadedToast(status) {
    // console.log(status);
    if (!toast.isActive("fileUploaded"))
      toast({
        id: "fileUploaded",
        title: "File Uploaded!",
        status: status.fileUploaded,
        duration: 5000,
        isClosable: false,
      });
  }
  function validateManualInput() {
    const numberValid = isValidPhoneNumber("+" + manualInput.number);
    // console.log(numberValid);
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
  //when task gets created succesfully
  useEffect(() => {
    socket.on("task_created", () => {
      var vCardBlob = new Blob([vCardOutput.mainString], {
        type: "text/vcard",
      });
      var vCardURL = window.URL.createObjectURL(vCardBlob);
      setVCardOutput({ ...vCardOutput, ready: true, downloadUrl: vCardURL });
      if (!toast.isActive("taskCreated"))
        toast({
          id: "taskCreated",
          title: "Task Created!",
          description: `Upload the .vcf to your whatsapp device and then check Validate Numbers to see the results.`,
          status: "success",
          duration: 5000,
          isClosable: false,
        });
      setLoading(false);
    });
  }, [socket]);
  useEffect(() => {
    if (selectedHeaders.Numbers) {
      // console.log("unformatted data");
      setFormData((prev) => ({
        ...prev,
        unformattedData: prev.unformattedData.map((row) => {
          return { ...row, unformattedNumber: row[selectedHeaders.Numbers] };
        }),
      }));
    }
  }, [selectedHeaders.Numbers]);
  return (
    <>
      <PageTitle>Create Validation Task</PageTitle>
      {!vCardOutput.ready ? ( //if vcardoutput is not ready
        <form onSubmit={handleCreateTaskFile} style={{ height: "100%" }}>
          {!formData.fileName ? ( //if filename not found then show initial form with both manual and file input
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="1.5em"
              height="100%"
            >
              {!file ? ( //if file not found in file input show upload button
                <>
                  <Stack color="whatsapp.500" position="relative">
                    <Text fontWeight="bold" color="whatsapp.500">
                      Input manually
                    </Text>
                    {formData.manualInputData.length != 0 && ( //if contacts are manually input then show clear and confirm button
                      <Stack
                        direction="row"
                        position="absolute"
                        top="-5%"
                        right="2%"
                      >
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, manualInputData: [] });
                          }}
                          leftIcon={<TbTrashXFilled />}
                          colorScheme="blackAlpha"
                          color="whiteAlpha.600"
                          _hover={{ borderColor: "red.500", color: "red.500" }}
                          isLoading={loading}
                        >
                          Clear
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="whatsapp"
                          type="button"
                          onClick={handleCreateTaskManual}
                          isLoading={loading}
                        >
                          Confirm
                        </Button>
                      </Stack>
                    )}
                    <Stack
                      bg="blackAlpha.400"
                      minH="3xs"
                      maxH="xs"
                      overflowY="auto"
                      borderRadius="md"
                      padding="2"
                    >
                      {formData.manualInputData.map((data) => {
                        return (
                          <ContactCard
                            key={data.number}
                            contact={{
                              contactNumber: data.number,
                              contactName: data.name,
                            }}
                          />
                        );
                      })}
                    </Stack>
                    <Stack direction="row" alignItems="flex-end">
                      <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                          placeholder="Name can be anything (email,id etc.)"
                          _placeholder={{ fontSize: "xs" }}
                          type="text"
                          borderColor="gray.700"
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
                          placeholder="Enter phone number with country code"
                          _placeholder={{ fontSize: "xs" }}
                          type="text"
                          borderColor="gray.700"
                          color="whatsapp.500"
                          value={manualInput.number}
                          onChange={(e) => {
                            setManualInput({
                              ...manualInput,
                              number: e.target.value.replace(/[+\s-()]/, ""),
                            });
                          }}
                        />
                      </FormControl>
                      <Button
                        colorScheme="blackAlpha"
                        color="whatsapp.500"
                        type="button"
                        onClick={validateManualInput}
                        isLoading={loading}
                      >
                        Add
                      </Button>
                    </Stack>
                  </Stack>
                  {formData.manualInputData.length == 0 && ( //if no manual input then show upload file button
                    <>
                      <Divider borderColor="whiteAlpha.300" />
                      <Text
                        maxW="md"
                        color="whatsapp.500"
                        textAlign="center"
                        fontSize="sm"
                      >
                        Upload your XLSX or CSV files containing the numbers.
                        Make sure to have <strong>atleast two columns</strong>,
                        one containing the <strong>numbers</strong> and the
                        other containing some form of{" "}
                        <strong>identifier</strong> like email, name etc. Also
                        change any header that matches these
                        <Tooltip
                          hasArrow
                          maxWidth="22ch"
                          placement="top-end"
                          fontWeight="bold"
                          label={`"unformattedNumber",\n"contactId",\n"contactChatId",\n"contactName",\n"contactPushName",\n"contactNumber",\n"contactVerifiedName",\n"contactVerifiedLevel",\n"contactIsWAContact",\n"contactLabels",\n"contactType",\n"contactProfilePicUrl",\n"queryName",\n"queryNumber"`}
                        >
                          <strong> keywords</strong>
                        </Tooltip>
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
                    </>
                  )}
                </>
              ) : (
                //if file found in file input show which file is selected and name of the file
                <>
                  <Text fontWeight="bold" color="whiteAlpha.500">
                    File Selected:
                  </Text>
                  <Text color="white">{file.name}</Text>
                </>
              )}

              {file && ( //if file exists show confirm and change file button
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
            //if filename exists then show form for selecting headers
            <Box
              width="sm"
              display="flex"
              flexDirection="column"
              gap="1em"
              alignItems="center"
              height="100%"
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
              <FormControl>
                <Checkbox
                  color="whatsapp.500"
                  colorScheme="whatsapp"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      keepInputFile: e.target.checked,
                    })
                  }
                >
                  <Text fontSize="sm">
                    Include input file <strong>{file.name}</strong>?
                  </Text>
                </Checkbox>
              </FormControl>
              <Button
                type="submit"
                colorScheme="whatsapp"
                width="120px"
                marginTop="3rem"
              >
                Create Task
              </Button>
            </Box>
          )}
        </form>
      ) : (
        //if vCard output is ready
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
