import { Router } from "express";
import * as controller from "../Controllers/authController.js";
import authVerify from "../Middlewares/authMiddlewear.js";

const router = Router();

router.post("/login", controller.loginController);

router.post("/register", controller.signupController);

router.delete("/remove-account", authVerify, controller.deleteAccountController);

export default router;
