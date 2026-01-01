import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/connectDB.js";
import authRouter from "./src/routes/authRoute.js";

dotenv.config();
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

app.use('/api/auth',authRouter)

app.listen(port,()=>{
    console.log("server started");
    connectDB();
})