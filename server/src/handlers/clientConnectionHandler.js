exports.clientConnection = function (socket, wwebjsClient) {
    var loggedOut = false;
    socket.on('log_out', async (data) => {
        console.log("logout server")
        await wwebjsClient.destroy()
        socket.disconnect();
        loggedOut = true;
    })
    socket.on('disconnect', async () => {
        console.log('Socket Disconnected')
        if (!loggedOut) {
            await wwebjsClient.destroy()
            console.log('Wwebjs client destroyed!')
        }
    })
}