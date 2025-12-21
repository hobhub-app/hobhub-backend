import WebSocket from "ws";
import connectedUsers from "./connectedUsers.js";

const sendToUser = (userId: number, data: unknown) => {
  const connections = connectedUsers.get(userId);

  if (!connections) return;

  const message = JSON.stringify(data);

  connections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
};

export default sendToUser;
