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
        // console.log("message", message)
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
exports.getMessageData = function (socket, db, activeClientData) {
    socket.on('get_message_data', async (message, callback) => {
        try {
            const messageData =
                await db.getData(`/clientsData/${activeClientData.id}/messagesData/${message.id}`)
            const messageDetails =
                await db.getData(`/clientsData/${activeClientData.id}/messages/${message.id}`)
            const final = { ...messageData, ...messageDetails }
            // console.log(final)
            callback(final)
        } catch (error) {
            console.log(error)
            callback({ status: "error" })
        }
    })
}
exports.sendMessage = function (socket, db, wwebjsClient, activeClientData) {
    socket.on('send_message', async (payload, callback) => {
        console.log(payload)
        try {
            await db.push(`/clientsData/${activeClientData.id}/messages/${payload.id}/sentTo`, payload.sentTo, true)
            callback({ status: "success" })
        } catch (error) {
            callback({ status: "error" })

        }
    })
}