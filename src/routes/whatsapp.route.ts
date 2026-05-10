import { Router, Request, Response } from "express";
import { askAI, resetConversation } from "../services/openai.service";
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
        this.router.get("/webhook", (req: Request, res: Response) => {
            const mode = req.query["hub.mode"];
            const token = req.query["hub.verify_token"];
            const challenge = req.query["hub.challenge"];

            if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
                res.status(200).send(challenge);
            } else {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: "Forbidden" });
            }
        });

        this.router.post("/webhook", async (req: Request, res: Response) => {
            try {
                const incoming = parseIncomingMessage(req.body);

                if (!incoming) {
                    res.set("Content-Type", "text/xml");
                    res.send("<Response></Response>");
                    return;
                }

                const { from, message } = incoming;
                console.log(`Message from ${from}: ${message}`);

                // Handle slash commands
                if (message.toLowerCase() === "/reset") {
                    resetConversation(from);
                    await sendWhatsAppReply(from, "Conversation reset! Let's start fresh. How can I help you? 😊");
                    res.set("Content-Type", "text/xml");
                    res.send("<Response></Response>");
                    return;
                }

                if (message.toLowerCase() === "/help") {
                    const helpMessage = `Here's what I can do:\n\n💬 *Chat* — Just send me any message!\n🔄 */reset* — Clear our conversation history\n❓ */help* — Show this help message\nℹ️ */info* — About this chatbot`;
                    await sendWhatsAppReply(from, helpMessage);
                    res.set("Content-Type", "text/xml");
                    res.send("<Response></Response>");
                    return;
                }

                if (message.toLowerCase() === "/info") {
                    const infoMessage = `🤖 *AI WhatsApp Chatbot*\n\nPowered by Groq AI\nBuilt with Node.js + TypeScript\nAll conversations logged to Google Sheets\n\nCreated with ❤️`;
                    await sendWhatsAppReply(from, infoMessage);
                    res.set("Content-Type", "text/xml");
                    res.send("<Response></Response>");
                    return;
                }

                // Regular AI response with memory
                const reply = await askAI(message, from);
                await logMessage(message, reply);
                await sendWhatsAppReply(from, reply);

                res.set("Content-Type", "text/xml");
                res.send("<Response></Response>");
            } catch (error) {
                console.error("WhatsApp Webhook Error:", error);
                res.set("Content-Type", "text/xml");
                res.send("<Response></Response>");
            }
        });
    }
}