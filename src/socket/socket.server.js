const {Server} = require('socket.io')

function setupSocketServer(httpServer) {
    const io = new Server(httpServer, {})

    io.on('connection', (socket) =>{
        console.log("A user connected");

        socket.on('ai-message', (message)=>{
            console.log(message)
        })
        
        socket.on('disconnected', ()=>{
            console.log('A user Disconnected');
        })
    })
}

module.exports = setupSocketServer