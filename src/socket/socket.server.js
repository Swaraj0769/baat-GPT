const {Server, Socket} = require('socket.io')

function setupSocketServer(httpServer) {
    const io = new Server(httpServer, {})

    io.on('connection', (socket) =>{
        console.log("A user connected");
        
    })
}

module.exports = setupSocketServer