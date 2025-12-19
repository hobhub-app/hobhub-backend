import { WebSocketServer } from "ws";

const setupWebSocketHandlers = (wss: WebSocketServer) => {
  // WebSocket connection handler
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.send("Welcome to the WebSocketServer");

    ws.on("message", (message) => {
      //TODO: Implement functionality for updating db
      console.log("Recieved: ", message.toString());
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });
};

export default setupWebSocketHandlers;
