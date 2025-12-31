import { WebSocketServer } from "ws";
import { verifyToken } from "../auth/utils.js";
import connectedUsers from "./connectedUsers.js";

const setupWebSocketHandlers = (wss: WebSocketServer) => {
  // WebSocket connection handler
  wss.on("connection", (ws, request) => {
    if (!request.url) {
      ws.close();
      return;
    }

    const url = new URL(request.url, "http://ws");
    const token = url.searchParams.get("token");

    if (!token) {
      ws.close();
      return;
    }

    const payload = verifyToken(token);

    if (!payload) {
      ws.close();
      return;
    }

    const userId = payload.userId;

    // Track connection
    const connections = connectedUsers.get(userId);
    if (connections) {
      connections.add(ws);
    } else {
      connectedUsers.set(userId, new Set([ws]));
    }

    console.log(`User ${userId} connected`);

    ws.on("close", () => {
      const userConnections = connectedUsers.get(userId);
      if (!userConnections) return;

      userConnections.delete(ws);
      if (userConnections.size === 0) {
        connectedUsers.delete(userId);
      }

      console.log(`User ${userId} disconnected`);
    });
  });
};

export default setupWebSocketHandlers;
