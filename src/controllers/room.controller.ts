import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { createError } from "../utils/createError.util";
import { createRoomSchema } from "../utils/validator.util";

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = createRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((err) => err.message)
        .join(", ");
      throw createError(errorMessage, 400);
    }

    const { name } = parsed.data;

    const room = await prisma.room.create({
      data: { name },
    });

    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw createError("Room ID is required", 400);
    }

    const room = await prisma.room.findUnique({
      where: { id: id.toString() },
    });

    if (!room) {
      throw createError("Room not found", 404);
    }

    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};
