const express = require('express');
const cors = require('cors')
// const qrcode = require('qrcode-terminal');
const fs = require('fs')
const { Client, LocalAuth } = require('whatsapp-web.js');
const http = require('http')
const { Server } = require('socket.io')
const { JsonDB, Config, DataError } = require('node-json-db');
const path = require('path');
const puppeteer = require('puppeteer');
const isPkg = typeof process.pkg !== 'undefined';

//mac path replace
let chromiumExecutablePath = (isPkg ?
    puppeteer.executablePath().replace(
        /^.*?\/node_modules\/puppeteer\/\.local-chromium/,
        path.join(path.dirname(process.execPath), 'chromium')
    ) :
    puppeteer.executablePath()
);

console.log(process.platform)
//check win32
if (process.platform == 'win32') {
    chromiumExecutablePath = (isPkg ?
        puppeteer.executablePath().replace(
            /^.*?\\node_modules\\puppeteer\\\.local-chromium/,
            path.join(path.dirname(process.execPath), 'chromium')
        ) :
        puppeteer.executablePath()
    );
}
const app = express();
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })
server.listen(5000, () => {
    console.log("Listening to port 5000!")
})

class WhatsAppContact {
    constructor(contactId = "",
        contactChatId = "",
        contactName = "",
        contactPushName = "",
        contactNumber = "",
        contactVerifiedName = "",
        contactVerifiedLevel = "",
        contactIsWAContact = false,
        contactLabels = "",
        contactType = "",
        contactProfilePicUrl = "") {
        this.contactId = contactId || "";
        this.contactChatId = contactChatId;
        this.contactName = contactName;
        this.contactPushName = contactPushName;
        this.contactNumber = contactNumber;
        this.contactVerifiedName = contactVerifiedName;
        this.contactVerifiedLevel = contactVerifiedLevel;
        this.contactIsWAContact = contactIsWAContact;
        this.contactLabels = contactLabels;
        this.contactType = contactType;
        this.contactProfilePicUrl = contactProfilePicUrl;
    }
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

io.on('connection', async (socket) => {
    const db = new JsonDB(new Config("dataPool", true, false, '/'));
    console.log("Socket id", socket.id)
    var clients = [];
    const clientData = {
        id: '',
        name: ''
    }
    try {
        clients = await db.getData('/clients');
        socket.emit('all_clients', clients)
    } catch (error) {
        //if /clients doesnt exist create new
        if (error.message.startsWith("Can't find dataPath: /clients.")) {
            db.push('/clients', clients);
            console.log('Created dataPool!');
        }
    };
    // console.log("clients:", clients);

    socket.on('set_client', (data) => {
        const isOldClient = clients.filter((o) => o.id === data.id && o.name === data.name)
        if (isOldClient.length == 0) {
            clientData.id = data.id
            clientData.name = data.name
            clients.push(clientData)
        }
        else {
            clientData.id = isOldClient[0].id
            clientData.name = isOldClient[0].name

        }
        socket.join(clientData.id)
        console.log('Connected to room', socket.client.id)
        socket.to(socket.client.id).emit('recieve_message', 'Loading client! Please wait...')

        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: clientData.id
            }),
            puppeteer: {
                args: ['--no-sandbox'],
            }

        });
        client.initialize();
        console.log("Client initialised!")
        console.log("Client id", clientData.id)
        client.on('qr', qr => {
            console.log(qr)
            socket.emit('qr_generated', qr)
        });
        //socket for wwebjs client is ready
        client.on('ready', () => {
            // console.log("isOldClient", isOldClient)
            if (isOldClient.length == 0) {
                try {
                    // console.log("clients", clients)
                    db.push('/clients', clients, true)
                    console.log("client added to db!")
                } catch (error) {
                    console.log(error)
                }
            }
            console.log('Client is ready!');
            socket.emit('client_ready', {
                id: clientData.id,
                name: clientData.name,
                message: 'Connected to WhatsApp Web! Client is now ready!'
            })
        });
        //socket to destroy wwebjs client
        socket.on('log_out', (data) => {
            console.log("logout server")
            client.destroy()
            socket.disconnect();
        })
        //socket to get all contacts
        socket.on('get_all_contacts', (data) => {
            console.log("Syncing datapool!")
            client.getContacts().then(async (contacts) => {
                // const dbContactData = await db.getData(`/clients[${await db.getIndex('/clients', clientData.id)}]/contacts`)//get data from db
                // let extraContacts = dbContactData.filter(o1 => !contacts.some(o2 => o1.contactId === o2.id.user))//check if it matches data from wwebjs
                const validatedData = [];

                for (let index = 0; index < contacts.length; index++) {
                    const contact = contacts[index];
                    if (!contact.isGroup && !contact.isMe && !contact.id._serialized.endsWith('@lid') && contact.name) {
                        const validate = new WhatsAppContact(
                            contact.id.user,
                            contact.id._serialized,
                            contact.name,
                            contact.pushname,
                            contact.number,
                            contact.verifiedName,
                            contact.verifiedLevel,
                            contact.isWAContact,
                            contact.labels,
                            contact.type,
                        )
                        if (data.profilePicUrl)
                            validate.contactProfilePicUrl = await contact.getProfilePicUrl() || ""
                        validatedData.push(validate);
                    }
                }
                await db.push(`/clientsData/${clientData.id}/contacts/contactsInDevice`, validatedData, true)
                // socket.emit('set_all_contacts', validatedData)
            })
        })
        socket.on('get_contacts_fragment', async (data) => {
            // The array to be paginated
            const contactsFromDb = await db.getData(`/clientsData/${clientData.id}/contacts/contactsInDevice`); // fill with your array data
            // Calculate the total number of pages
            const totalPages = Math.ceil(contactsFromDb.length / data.itemsPerPage);

            // Calculate the start and end indexes for the specified page
            const startIndex = (data.page - 1) * data.itemsPerPage;
            const endIndex = startIndex + data.itemsPerPage;

            // Slice the array to get the items for the specified page
            const pageItems = contactsFromDb.slice(startIndex, endIndex);
            // console.log(pageItems)
            // Return the page data
            socket.emit('set_contacts_fragment',
                {
                    page: data.page,
                    totalPages: totalPages,
                    items: pageItems
                }
            )
        })
        socket.on('create_task', async (data) => {
            var dateOptions = {};
            dateOptions.year = dateOptions.month = dateOptions.day = dateOptions.hour = dateOptions.minute = dateOptions.second = 'numeric'
            await db.push(`/clientsData/${clientData.id}/tasks/${data.id}`, {
                createdAt: new Date().toLocaleString('sv-SE', dateOptions),
                length: data.data.length
            }, true)
            await db.push(`/clientsData/${clientData.id}/tasksData/${data.id}`, data.data, true)
        })
        socket.on('get_tasks', async (data) => {
            try {
                const allTasks = await db.getData(`/clientsData/${clientData.id}/tasks`)
                socket.emit('all_tasks', allTasks)
            } catch (error) {

            }
        })
        socket.on('get_task_data', async (taskId) => {
            try {
                const taskData = await db.getData(`/clientsData/${clientData.id}/tasksData/${taskId}`)
                socket.emit('task_data', taskData);
            } catch (error) {
                console.log(error)
            }
        })
        socket.on('delete_task', async (taskId) => {
            console.log('deleted task:', taskId)
            await db.delete(`/clientsData/${clientData.id}/tasks/${taskId}`)
            await db.delete(`/clientsData/${clientData.id}/tasksData/${taskId}`)
        })
        socket.on('get_task_results', async (taskId) => {
            const taskData = await db.getData(`/clientsData/${clientData.id}/tasksData/${taskId}`)
            const dbContactData = await db.getData(`/clientsData/${clientData.id}/contacts/contactsInDevice`)//get data from db
            const match = []
            const noMatch = []
            taskData.filter(taskelement => dbContactData.some((contact) =>
                taskelement.number === contact.contactNumber && match.push({
                    ...contact,
                    queryName: taskelement.name || "",
                    queryNumber: taskelement.number || "",
                })));
            // console.log(match)
            taskData.filter(o1 => !match.some(o2 => o1.number === o2.queryNumber) && noMatch.push({
                ...new WhatsAppContact(),
                queryName: o1.name || "",
                queryNumber: o1.number || "",
            }))

            const result = [...match, ...noMatch]
            console.log("getting task results for ", taskId)
            console.log("resultSize", result.length)
            result.length < 10 && console.log("result", result)
            socket.emit('task_results', result);
        })
        socket.on('send_message', async (data) => {
            for (let index = 0; index < data.reciever.length; index++) {
                const reciever = data.reciever[index];
                await timeout(3000);
                console.log("message sent to ", reciever)
                // await client.sendMessage(reciever, data.message)
            }
            socket.emit('message_sent', true)
        })
    })
    socket.on('delete_client', async (data) => {
        console.log(`Deleting ${data.clientId}`)
        //delete clients from client aggregate /clients[]
        try {
            await db.delete(`/clients[` + await db.getIndex("/clients", data.clientId) + "]")
            socket.emit('client_deleted');
            console.log(`Deleted ${data.clientId} `)
        } catch (error) {
            console.log(`Error deleting ${data.clientId} `)
        }
        //delete clients data
        try {
            await db.delete(`/clientsData/${data.clientId}`)
            socket.emit('client_deleted');
            console.log(`Deleted ${data.clientId}'s data`)
        } catch (error) {
            console.log(`Error deleting clients Data${data.clientId} `)
        }
    })

})
