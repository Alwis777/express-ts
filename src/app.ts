import express, { Application } from "express";
import greetingRoute from "./routes/greeting.route";

const app:Application = express();

app.use(express.json());
app.use("/greeting",greetingRoute);
app.get( "/", (req, res) => {
    res.send("Hello World");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`);
});