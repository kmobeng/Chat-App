import type { Request, Response, NextFunction } from "express";
import { getRoomMessages } from "../services/message.service";
import { createError } from "../utils/createError.util";

export const getMessagesByRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
     if (!id) {
        throw createError("Room ID is required", 400);
     }
   
    const messages = await getRoomMessages(id.toString());

    return res.status(200).json(messages);
  } catch (error) {
    return next(error);
  }
};
