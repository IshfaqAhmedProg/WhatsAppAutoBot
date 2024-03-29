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
exports.sendTextMessage = function (socket, db, wwebjsClient, activeClientData) {
    socket.on('send_message', async (payload, callback) => {
        // console.log(payload)
        //payload={id:'',to:'',message:''}
        try {
            await wwebjsClient.sendMessage(payload.to, payload.message)
            await db.push(`/clientsData/${activeClientData.id}/messages/${payload.id}/sentTo[]`, payload.to, true)
            const sentTo = await db.getData(`/clientsData/${activeClientData.id}/messages/${payload.id}/sentTo`)
            console.log(`Message sent to: ${payload.to}`)

            callback({ data: sentTo, error: false })
        } catch (error) {
            console.log(`Message sending to ${payload.to} failed!`)
            callback({ data: {}, error: false })
        }
    })
}
exports.getAllMessages = function (socket, db, activeClientData) {
    socket.on('get_all_messages', async (payload, callback) => {
        // console.log(payload)
        try {
            const allMessages = await db.getData(`/clientsData/${activeClientData.id}/messages/`)
            callback({ data: allMessages, error: false })
        } catch (error) {
            callback({ data: {}, error: true })
        }
    })
}
exports.deleteMessage = function (socket, db, activeClientData) {
    socket.on('delete_messages', async (payload, callback) => {
        try {
            await db.delete(`/clientsData/${activeClientData.id}/messages/${payload.id}`)
            await db.delete(`/clientsData/${activeClientData.id}/messagesData/${payload.id}`)
            console.log('Deleted message:', payload.id)
            callback({ error: false })
        } catch (err) {
            console.log('Deleting message error:', err)
            callback({ error: true })
        }
    })
}