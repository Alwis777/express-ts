import { Router, Request, Response } from "express";
import { askAI } from "../services/openai.service";

export class AIRoute {
    private static instance: AIRoute;
    public router: Router;

    public static getInstance(): AIRoute {
        if (!AIRoute.instance) {
            AIRoute.instance = new AIRoute();
        }
        return AIRoute.instance;
    }

    private constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes() {
        this.router.post("/ask", async (req: Request, res: Response) => {
            const { message } = req.body;
            const reply = await askAI(message);
            res.json({ reply });
        });
    }
}