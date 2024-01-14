import express from "express";
const router = express.Router();
import leadsRouter from "./leadsRouter";

router.use("/leads", leadsRouter);

export default router;
