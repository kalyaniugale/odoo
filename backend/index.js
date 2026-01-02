import express from "express";
import dotenv from "dotenv";
dotenv.config(); 
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/connectDB.js";
import authRouter from "./src/routes/authRoute.js";
import passport from "passport";
import "./src/config/passport.js";
import { googleSuccess } from "./src/controllers/authController.js";


const app=express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:process.env.client_Url,
    credentials:true
}));

app.get('/',(req,res)=>{
    res.send("hello from server ")
})
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  googleSuccess
);
app.use(passport.initialize());
app.use('/api/auth',authRouter)

app.listen(port,()=>{
    console.log("server started");
    connectDB();
})