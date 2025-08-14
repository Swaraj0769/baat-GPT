const { Server } = require('socket.io');
const aiService = require('../services/ai.service');

function setupSocketServer(httpServer) {
    const io = new Server(httpServer, {});

    io.on('connection', (socket) => {
        console.log("A user connected");

        socket.on('ai-message', async (message) => {
            try {
                const result = await aiService.generateContent(message.content);
                socket.emit("ai-message-response", result);
            } catch (error) {
                console.error("Error generating content:", error);
                socket.emit("ai-message-response", "Sorry, I couldn't process that.");
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}

module.exports = setupSocketServer;