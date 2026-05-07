import { prisma } from "../config/db";


export const getRoomMessages = async (roomId: string, limit?: number) => {
  return await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    ...(typeof limit === "number" ? { take: limit } : {}),
  });
};
