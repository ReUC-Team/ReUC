import express from "express";
import { mobileAuthRouter } from "../auth/mobile.js";
import { mobileApplicationRouter } from "../application/mobile.js";
import { mobileProfileRouter } from "../profile/mobile.js";
import { mobileProjectRouter } from "../project/mobile.js";

const mobileRouter = express.Router();

mobileRouter.use("/auth", mobileAuthRouter);
mobileRouter.use("/application", mobileApplicationRouter);
mobileRouter.use("/profile", mobileProfileRouter);
mobileRouter.use("/project", mobileProjectRouter);

export default mobileRouter;
