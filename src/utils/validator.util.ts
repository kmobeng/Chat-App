import {z} from "zod"

export const getRoomMessagesQuerySchema = z.object({
  limit: z.coerce.number().positive().optional(),
});

export const createRoomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
});

export const connectionSchema = z.object({
  roomId: z.string().min(1),
  username: z.string().min(1),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1),
});

export const sendReactionSchema = z.object({
  emoji: z.string().min(1),
});