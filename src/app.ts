import express, { Application } from "express";
import { Routes } from "./routes/routes";

const app:Application = express();

app.use(express.json());
app.use("/api",Routes.getInstance().router);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`);
});