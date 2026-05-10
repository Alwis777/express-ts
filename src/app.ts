import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import { Routes } from "./routes/routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", Routes.getInstance().router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`);
});