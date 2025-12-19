import express, { Express } from "express";
import cors from "cors";
import http from "http";
import { prisma } from "./config/prisma.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { readFileSync } from "fs";
import { resolvers } from "./resolvers/index.js";
import context from "./auth/context.js";
import { WebSocketServer } from "ws";
import setupWebSocketHandlers from "./utils/websocket.js";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// GraphQL setup
const typeDefs = readFileSync("src/schema.graphql", {
  encoding: "utf-8",
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const httpServer = http.createServer(app);
const wss = new WebSocketServer({ server: httpServer });

async function start() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma");

    // Start Apollo Server
    await server.start();
    console.log("Apollo Server started");

    // Add GraphQL endpoint
    app.use("/graphql", expressMiddleware(server, { context }));

    // Set up WebSocket
    setupWebSocketHandlers(wss);

    // Shared HTTP server for Express, GraphQL and WebSockets
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(
        `GraphQL endpoint available at http://localhost:${PORT}/graphql`
      );
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
