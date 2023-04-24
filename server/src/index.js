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
const { getAllContacts, getContactsFragment } = require('./functions/contactsHandler');
const { getTasks, createTask, getTaskData, deleteTask, getTaskResults } = require('./functions/tasksHandler');
const { clientConnection } = require('./functions/clientConnectionHandler');
const { WhatsAppContact } = require('./classes/WhatsAppContact');
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

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

io.on('connection', async (socket) => {
    console.log("Socket id", socket.id)
    //On connection create database context
    const db = new JsonDB(new Config("dataPool", true, false, '/'));
    var clients = [];
    const activeClientData = {
        id: '',
        name: ''
    }
    //emit the available clients
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

    //once client is chosen by the user
    socket.on('set_client', (data) => {
        //check if client is an old client or not
        const isOldClient = clients.filter((o) => o.id === data.id && o.name === data.name)
        //if not old client then add it to clientData and push to client array or else put the oldclient on clientData
        if (isOldClient.length == 0) {
            activeClientData.id = data.id
            activeClientData.name = data.name
            clients.push(activeClientData)
        }
        else {
            activeClientData.id = isOldClient[0].id
            activeClientData.name = isOldClient[0].name
        }
        //join a room with the client id not used yet to make comms more specific
        socket.join(activeClientData.id)
        console.log('Connected to room', socket.client.id)
        socket.to(socket.client.id).emit('recieve_message', 'Loading client! Please wait...')
        //create a whatsappwebjs client
        const wwebjsClient = new Client({
            authStrategy: new LocalAuth({
                clientId: activeClientData.id
            }),
            puppeteer: {
                args: ['--no-sandbox'],
            }
        });
        //initialise the whatsappwebjs client
        wwebjsClient.initialize();
        console.log("Client initialised!")
        console.log("Client id", activeClientData.id)
        //if not logged in for a while or new client needs to scan the qr code
        wwebjsClient.on('qr', qr => {
            console.log(qr)
            socket.emit('qr_generated', qr)
        });
        //socket for wwebjs client is ready
        wwebjsClient.on('ready', () => {
            // console.log("isOldClient", isOldClient)
            //if client is ready push the list with the new client to the db to update the db
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
                id: activeClientData.id,
                name: activeClientData.name,
                message: 'Connected to WhatsApp Web! Client is now ready!'
            })
        });

        //client logged in context---
        getAllContacts(socket, db, wwebjsClient, activeClientData)
        getContactsFragment(socket, db, activeClientData)
        createTask(socket, db, activeClientData)
        getTasks(socket, db, activeClientData)
        getTaskData(socket, db, activeClientData)
        getTaskResults(socket, db, activeClientData)
        deleteTask(socket, db, activeClientData)

        //handle logouts and disconnect
        clientConnection(socket, wwebjsClient)
        // socket.on('send_message', async (data) => {
        //     for (let index = 0; index < data.reciever.length; index++) {
        //         const reciever = data.reciever[index];
        //         await timeout(3000);
        //         console.log("message sent to ", reciever)
        //         // await client.sendMessage(reciever, data.message)
        //     }
        //     socket.emit('message_sent', true)
        // })
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
