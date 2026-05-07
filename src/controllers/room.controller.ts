import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { createError } from "../utils/createError.util";

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body as { name: string };

    const existingRoom = await prisma.room.findUnique({
      where: { name },
    });

    if (existingRoom) {
      return res.status(409).json({ error: "Room name already exists" });
    }

    const room = await prisma.room.create({
      data: { name },
    });

    return res.status(201).json(room);
  } catch (error) {
    return next(error);
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

    return res.status(200).json(rooms);
  } catch (error) {
    return next(error);
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
      return res.status(404).json({ error: "Room not found" });
    }

    return res.status(200).json(room);
  } catch (error) {
    return next(error);
  }
};
