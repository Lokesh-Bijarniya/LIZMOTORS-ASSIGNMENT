import { Router } from "express";
import { authUser, registerUser } from "../controllers/authController.js";

const router = Router();

router.post('/create', registerUser);
router.post('/login', authUser);

export default router;