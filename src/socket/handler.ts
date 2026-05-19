import type { Server, Socket } from "socket.io";
import { getRoomMessages } from "../services/message.service";
import {
  addUser,
  cleanupRoom,
  getActiveUsernames,
  removeUser,
} from "./roomManager";
import type {
  ClientToServerEvents,
  SendMessagePayload,
  SendReactionPayload,
  ServerToClientEvents,
} from "./types";
import { prisma } from "../config/db";
import {
  connectionSchema,
  sendMessageSchema,
  sendReactionSchema,
} from "../utils/validator.util";

const normalizeQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export const handler = async (io: TypedServer, socket: TypedSocket) => {
  const parsedQuery = connectionSchema.safeParse({
    roomId: normalizeQueryValue(socket.handshake.query.roomId),
    username: normalizeQueryValue(socket.handshake.query.username),
  });

  if (!parsedQuery.success) {
    socket.emit("error", { message: "Invalid connection parameters" });
    socket.disconnect();
    return;
  }

  const { roomId, username } = parsedQuery.data;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    socket.emit("error", { message: "Room not found" });
    socket.disconnect();
    return;
  }

  socket.join(roomId);
  addUser(roomId, socket.id, username);

  const messages = await getRoomMessages(roomId, 50);
  const history = messages.map((message) => ({
    id: message.id,
    username: message.username,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  }));

  socket.emit("room_history", { messages: history });

  io.to(roomId).emit("user_joined", {
    username,
    activeUsers: getActiveUsernames(roomId),
  });

  socket.on("send_message", async (payload: SendMessagePayload) => {
    const parsedPayload = sendMessageSchema.safeParse(payload);
    if (!parsedPayload.success) {
      socket.emit("error", { message: "Invalid message payload" });
      return;
    }

    const message = await prisma.message.create({
      data: {
        content: parsedPayload.data.content,
        username,
        roomId,
      },
    });

    io.to(roomId).emit("new_message", {
      from: message.username,
      content: message.content,
      timestamp: message.createdAt.toISOString(),
    });
  });

  socket.on("send_reaction", (payload: SendReactionPayload) => {
    const parsedPayload = sendReactionSchema.safeParse(payload);
    if (!parsedPayload.success) {
      socket.emit("error", { message: "Invalid reaction payload" });
      return;
    }

    io.to(roomId).emit("new_reaction", {
      from: username,
      emoji: parsedPayload.data.emoji,
    });
  });

  socket.on("disconnect", () => {
    const removedUsername = removeUser(roomId, socket.id);
    const activeUsers = getActiveUsernames(roomId);

    io.to(roomId).emit("user_left", {
      username: removedUsername ?? username,
      activeUsers,
    });

    if (activeUsers.length === 0) {
      cleanupRoom(roomId);
    }
  });
};
