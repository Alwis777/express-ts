import { Router, Request, Response } from "express";
import { askAI } from "../services/openai.service";
import { logMessage } from "../services/sheets.service";
import { parseIncomingMessage, sendWhatsAppReply } from "../services/whatsapp.service";
import { HttpStatus } from "../common/constants/httpStatus.enum";

export class WhatsAppRoute {
    private static instance: WhatsAppRoute;
    public router: Router;

    public static getInstance(): WhatsAppRoute {
        if (!WhatsAppRoute.instance) {
            WhatsAppRoute.instance = new WhatsAppRoute();
        }
        return WhatsAppRoute.instance;
    }

    private constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes() {
        // Webhook verification
        this.router.get("/webhook", (req: Request, res: Response) => {
            const mode = req.query["hub.mode"];
            const token = req.query["hub.verify_token"];
            const challenge = req.query["hub.challenge"];

            if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
                console.log("Webhook verified!");
                res.status(200).send(challenge);
            } else {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: "Forbidden" });
            }
        });

        // Receive messages
        this.router.post("/webhook", async (req: Request, res: Response) => {
            try {
                const incoming = parseIncomingMessage(req.body);

                if (!incoming) {
                    res.sendStatus(200);
                    return;
                }

                const { from, message } = incoming;
                console.log(`Message from ${from}: ${message}`);

                const reply = await askAI(message);
                await logMessage(message, reply);
                await sendWhatsAppReply(from, reply);

                res.sendStatus(200);
            } catch (error) {
                console.error("WhatsApp Webhook Error:", error);
                res.sendStatus(200);
            }
        });
    }
}