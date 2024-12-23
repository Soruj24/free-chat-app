const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const port = 4000;

// CORS Middleware
app.use(
    cors({
        origin: "http://localhost:5173", // React app URL
        credentials: true,
    })
);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // React app URL
        methods: ["GET", "POST"],
        credentials: true,
    },
});


io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // When a user sends a message
    socket.on("chat", (message) => {
        // Send the message with socket ID to differentiate users
        io.emit("chat_show", { message, senderId: socket.id });
        console.log("Message received from", socket.id, ":", message);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
