const express = require('express');
const cors = require('cors')
// const qrcode = require('qrcode-terminal');
const fs = require('fs')
const { Client, LocalAuth } = require('whatsapp-web.js');
const http = require('http')
const { Server } = require('socket.io')
const { JsonDB, Config, DataError } = require('node-json-db');
const app = express();
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] } })
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
        if (error.message.startsWith("Can't find dataPath: /clients."))
            db.push('/clients', clients);
        console.log(error);
    };
    console.log("clients:", clients);

    socket.on('set_client', (data) => {
        socket.emit('recieve_message', 'Checking for client! Please wait...')
        const isOldClient = clients.filter((o) => o.name === data.name)
        if (isOldClient.length == 0) {
            clientData.id = data.id
            clientData.name = data.name
            clients.push(clientData)
        }
        else {
            clientData.id = isOldClient[0].id
            clientData.name = isOldClient[0].name

        }

        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: clientData.id
            })
        });
        client.initialize();
        console.log("client initialised!")
        // var data = [];
        socket.join(clientData.id)
        console.log("client id", clientData.id)
        client.on('qr', qr => {
            console.log(qr)
            socket.emit('qr_generated', qr)
        });
        client.on('ready', () => {
            console.log("isOldClient", isOldClient)
            if (isOldClient.length == 0) {
                try {
                    console.log("clients", clients)
                    db.push('/clients', clients, true)
                    console.log("client added to db!")
                } catch (error) {
                    console.log(error)
                }
            }
            console.log('Client is ready!');
            socket.emit('client_ready', 'Connected to WhatsApp Web! Client is now ready!')
        });

    })
    socket.on('log_out', (data) => {
        socket.disconnect();
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
