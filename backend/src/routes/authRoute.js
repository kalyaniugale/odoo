import express from "express";
import isAuth from "../middlewares/isAuth.js"
import { login, logout, signup ,getMe} from "../controllers/authController.js";
const authRouter=express.Router();

authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.get("/me", isAuth, getMe)

export default authRouter