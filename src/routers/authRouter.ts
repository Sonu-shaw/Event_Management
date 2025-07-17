import express from "express"
import { login, register, verifyEmail } from "../controllers/auth"

const router  = express.Router()

router.post("/register", register);
router.post("/login", login);
router.post("/verify-mail", verifyEmail);

export const AuthRoutes = router;