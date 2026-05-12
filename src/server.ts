import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app";
import { handler } from "./socket/handler";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./socket/types";
import logger from "./config/winston.config";

dotenv.config();

const PORT = Number(process.env.PORT);

const startServer = async () => {
  const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => handler(io, socket));
};

startServer();
