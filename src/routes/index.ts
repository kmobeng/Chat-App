import { Router } from "express";
import { z } from "zod";
import {
  createRoom,
  getRoomById,
  getRooms,
} from "../controllers/room.controller";
import { getMessagesByRoom } from "../controllers/message.controller";

const router = Router();

const createRoomSchema = z.object({
  name: z.string().min(1),
});

router.post("/rooms", createRoom);
router.get("/rooms", getRooms);
router.get("/rooms/:id", getRoomById);
router.get("/rooms/:id/messages", getMessagesByRoom);

export default router;
