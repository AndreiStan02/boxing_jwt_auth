import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { APP_ORIGIN, PORT } from "./constants/env.js";
import { OK } from "./constants/http.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./routes/authRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(OK).send({ status: "healthy" });
});

app.use(errorHandler);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
