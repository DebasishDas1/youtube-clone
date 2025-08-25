import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createRouteHandler } from "uploadthing/express";
// import { uploadRouter } from "./uploadthing";

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
// app.use(
//   "/api/uploadthing",
//   createRouteHandler({
//     router: uploadRouter,
//     // config: { ... },
//   })
// );

// Importing routes
import userRouter from "./route/user.route.js";

// Using routes
app.use("/api/v1/users", userRouter);

export default app;
