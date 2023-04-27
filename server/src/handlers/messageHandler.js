const { formattedDate } = require("../utils/formattedDate");

exports.saveMessage = function (socket, db, activeClientData) {
    socket.on('save_message', async (message, callback) => {
        try {
            await db.push(`/clientsData/${activeClientData.id}/messages/${message.id}`, {
                createdAt: formattedDate(),
            }, true)
            await db.push(`/clientsData/${activeClientData.id}/messagesData/${message.id}`, message.data, true)
            callback({ messageSaved: 'success' })
            console.log('Message saved!')
        }
        catch (err) {
            callback({ messageSaved: 'error' })
            console.log('Error saving message!')
        }
    })
}
exports.saveReceivers = function (socket, db, activeClientData) {
    socket.on('save_receivers', async (message, callback) => {
        console.log("message", message)
        try {
            await db.push(`/clientsData/${activeClientData.id}/messages/${message.id}/receivers`, message.receivers, true)
            await db.push(`/clientsData/${activeClientData.id}/messages/${message.id}/toAll`, message.toAll, true)
            callback({ receiversSaved: 'success' })
            console.log('Receiver saved!')
        } catch (error) {
            callback({ receiversSaved: 'error' })
            console.log('Error saving receiver!')
        }
    })
}