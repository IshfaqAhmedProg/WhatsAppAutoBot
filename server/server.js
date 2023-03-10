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


function addNewClientToDB(db, dPData) {
    try {
        console.log("dPData", dPData);
        db.push('/clients[]', dPData, true)
        console.log("client added to db!")
    } catch (error) {
        console.log(error)
    }
}
io.on('connection', async (socket) => {
    const db = new JsonDB(new Config("dataPool", true, false, '/'));
    console.log("socket.id", socket.id)
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
        console.log('connected to room', socket.client.id)
        socket.to(socket.client.id).emit('recieve_message', 'Checking for client! Please wait...')

        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: clientData.id
            })
        });
        client.initialize();
        console.log("client initialised!")
        console.log("client id", clientData.id)
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
        })
        //socket to get all contacts
        socket.on('get_all_contacts', (data) => {
            console.log("getting all contacts")
            client.getContacts().then(async (contacts) => {
                // const dbContactData = await db.getData(`/clients[${await db.getIndex('/clients', clientData.id)}]/contacts`)//get data from db
                // let extraContacts = dbContactData.filter(o1 => !contacts.some(o2 => o1.contactId === o2.id.user))//check if it matches data from wwebjs
                const validatedData = [];

                for (let index = 0; index < contacts.length; index++) {
                    const contact = contacts[index];
                    if (!contact.isGroup && !contact.isMe && !contact.id._serialized.endsWith('@lid')) {
                        const validate = {
                            contactId: contact.id.user,
                            contactChatId: contact.id._serialized,
                            contactName: contact.name || "unavailable",
                            contactPushName: contact.pushname || "unavailable",
                            contactNumber: contact.number || "unavailable",
                            contactVerifiedName: contact.verifiedName || "unavailable",
                            contactVerifiedLevel: contact.verifiedLevel || "unavailable",
                            contactIsWAContact: contact.isWAContact,
                            contactLabels: contact.labels,
                            contactType: contact.type,
                        }
                        if (data.profilePicUrl)
                            validate.contactProfilePicUrl = await contact.getProfilePicUrl()
                        validatedData.push(validate);
                    }
                }
                await db.push(`/clientsData/${clientData.id}/contacts`, validatedData, true)
                socket.emit('set_all_contacts', validatedData)
            })
        })
        socket.on('create_task', async (data) => {
            await db.push(`/clientsData/${clientData.id}/tasks/${data.id}`, {
                createdAt: new Date().toISOString(),
                length: data.data.length
            }, true)
            await db.push(`/clientsData/${clientData.id}/tasksData/${data.id}`, data.data, true)
        })
        socket.on('get_tasks', async (data) => {
            try {
                const allTasks = await db.getData(`/clients[${await db.getIndex('/clients', clientData.id)}]/tasks`)

            } catch (error) {

            }
        })
    })


})
// app.use('/api',
//     async (req, res, next) => {

//         var data = [];
//         const client = new Client({
//             authStrategy: new LocalAuth()
//         });
//         client.initialize();
//         console.log(client);
//         client.on('authenticated', (session) => {
//             console.log("session", session)
//         })
//         await checkIfQR(client).then(qr => {
//             console.log("qr", qr)
//             res.json(qr)
//         })
//         client.on('ready', () => {
//             console.log('Client is ready!');
//             res.sendStatus(200)
//         });
//     }, (req, res, next) => {

//     })
// app.get('/api', (req, res) => {
//     res.json({ users: ["userOne", "userTwo"] });
//     console.log("run this")
// })
// function checkIfQR(client) {
//     return new Promise((resolve, reject) => {
//         client.on('qr', qr => {
//             console.log(qr)
//             qrcode.generate(qr, { small: true });
//             resolve(qr);
//         });
//     })
// }
// app.listen(5000, () => { console.log("server started on port 5000"); })
// function runWhatsappWeb(clientId) {
//     var password = encodeURIComponent("hpWMLUYgnCbY1A9P")
//     mongoose.connect(`mongodb+srv://ishfaqahmed0837:${password}@whatsappvalidator.ou3i6ti.mongodb.net/?retryWrites=true&w=majority`).then(() => {
//         var data = [];
//         const store = new MongoStore({ mongoose: mongoose });
//         const client = new Client({
//             authStrategy: new RemoteAuth({
//                 clientId: clientId,
//                 store: store,
//                 backupSyncIntervalMs: 300000
//             })
//         });
//         client.initialize();

//         client.on('qr', qr => {
//             data = qr;
//             qrcode.generate(qr, { small: true });
//         });

//         client.on('ready', () => {
//             console.log('Client is ready!');
//             client.getContacts().then(contacts => {
//                 const validatedData = [];
//                 contacts.forEach(contact => {
//                     if (contact.isGroup == false) {
//                         const validate = {
//                             name: contact.name || "unavailable",
//                             originalName: contact.pushname || "unavailable",
//                             number: contact.number || "unavailable",
//                             hasWhatsApp: contact.isWAContact
//                         }
//                         contact.getProfilePicUrl()
//                         validatedData.push(validate);
//                     }
//                 });
//                 data = validatedData;
//                 console.log(data)
//             })
//         });
//         return data;
//     });
// }
