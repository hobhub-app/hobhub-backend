import WebSocket from "ws";

const connectedUsers = new Map<number, Set<WebSocket>>();

export default connectedUsers;
