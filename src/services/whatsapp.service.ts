export interface WhatsAppMessage {
    from: string;
    message: string;
}

export const parseIncomingMessage = (body: any): WhatsAppMessage | null => {
    try {
        // Twilio sends messages in this format
        const message = body?.Body;
        const from = body?.From?.replace("whatsapp:", "");

        if (!message || !from) return null;

        return {
            from,
            message,
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
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const from = (process.env.TWILIO_WHATSAPP_NUMBER || "").replace(/\s/g, "");

        const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
                },
                body: new URLSearchParams({
                    From: `whatsapp:${from}`,
                    To: `whatsapp:${to}`,
                    Body: message,
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Twilio error:", error);
            throw new Error("Failed to send WhatsApp message");
        }
    } catch (error) {
        console.error("Send WhatsApp Reply Error:", error);
        throw error;
    }
};