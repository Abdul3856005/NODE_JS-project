import express from "express";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";


export const app = express();

  


dotenv.config({
    path: "./data/config.env",
});

// Using middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
}))

//using routes =>routes must be installed below middleware:-
app.use("/users", userRouter);
app.use("/task", taskRouter);

app.get("/", (req, res) => {
    res.send("Nice working");
});


// using error middleWare
app.use(errorMiddleware);
