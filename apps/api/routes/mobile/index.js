import express from "express";
import { mobileAuthRouter } from "../auth/mobile.js";
import { mobileApplicationRouter } from "../application/mobile.js";
import { mobileProfileRouter } from "../profile/mobile.js";

const mobileRouter = express.Router();

mobileRouter.use("/auth", mobileAuthRouter);
mobileRouter.use("/application", mobileApplicationRouter);
mobileRouter.use("/profile", mobileProfileRouter);

export default mobileRouter;
