export interface WhatsAppMessage {
    from: string;
    message: string;
}

export const parseIncomingMessage = (body: any): WhatsAppMessage | null => {
    try {
        const entry = body?.entry?.[0];
        const change = entry?.changes?.[0];
        const message = change?.value?.messages?.[0];

        if (!message) return null;

        return {
            from: message.from,
            message: message.text?.body || "",
        };
    } catch (error) {
        console.error("Error parsing WhatsApp message:", error);
        return null;
    }
};

export const sendWhatsAppReply = async (
    to: string,
    message: string
): Promise<void> => {
    const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;
    const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER;

    const response = await fetch(
        `https://waba-sandbox.360dialog.io/v1/messages`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "D360-API-KEY": WHATSAPP_API_KEY || "",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to,
                type: "text",
                text: { body: message },
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to send WhatsApp message");
    }
};