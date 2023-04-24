exports.clientConnection = function (socket, wwebjsClient) {
    var loggedOut = false;
    socket.on('log_out', (data) => {
        console.log("logout server")
        wwebjsClient.destroy()
        socket.disconnect();
        loggedOut = true;
    })
    socket.on('disconnect', () => {
        if (loggedOut == false) {
            console.log('Socket Disconnected')
            wwebjsClient.destroy()
        }
    })
}