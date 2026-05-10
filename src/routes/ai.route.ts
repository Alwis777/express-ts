import { Router, Request, Response } from "express";
import { askAI } from "../services/openai.service";
import { logMessage, getLogs } from "../services/sheets.service";
import { HttpStatus } from "../common/constants/httpStatus.enum";

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
            try {
                const { message } = req.body;

                if (!message) {
                    res.status(HttpStatus.BAD_REQUEST).json({
                        error: "Message is required",
                    });
                    return;
                }

                const reply = await askAI(message);
                await logMessage(message, reply);
                res.status(HttpStatus.OK).json({ reply });

            } catch (error) {
                console.error("Route Error:", error);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: "Something went wrong. Please try again.",
                });
            }
        });

        this.router.get("/logs", async (req: Request, res: Response) => {
            try {
                const logs = await getLogs();
                res.status(HttpStatus.OK).json({ logs });
            } catch (error) {
                console.error("Logs Error:", error);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: "Failed to fetch logs.",
                });
            }
        });
    }
}