import express from "express";
const router = express.Router();
import leadsController from "../controllers/leadsController";
import authMiddleware from "../middleware/authMiddleware";
router.get("/", authMiddleware, leadsController.getData);

export default router;
