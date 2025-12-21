import WebSocket from "ws";

export const connectedUsers = new Map<number, Set<WebSocket>>();
