exports.deleteClient = function (socket, db) {
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
}