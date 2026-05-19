import { prisma } from "../config/db";
import { createError } from "../utils/createError.util";
import { getRoomMessagesQuerySchema } from "../utils/validator.util";

export const getRoomMessages = async (roomId: string, limit?: number) => {
  const parsed = getRoomMessagesQuerySchema.safeParse({ limit });
  if (!parsed.success) {
    throw createError("Invalid limit parameter", 400);
  }

  return await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    ...(parsed.data.limit && { take: parsed.data.limit }),
  });
};
