const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

let latestGPS = null;

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (data) => {
        try {
            const gps = JSON.parse(data);
            latestGPS = gps;

            // broadcast to all browser clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(gps));
                }
            });

        } catch (e) {
            console.log("Invalid data");
        }
    });
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
