exports.clientConnection = function (socket, wwebjsClient) {
    var loggedOut = false;
    socket.on('log_out', (data) => {
        console.log("logout server")
        wwebjsClient.destroy()
        socket.disconnect();
        loggedOut = true;
    })
    socket.on('disconnect', async () => {
        console.log('Socket Disconnected')
        await wwebjsClient.destroy()
        console.log('Wwebjs client destroyed!')
    })
}