import Groq from "groq-sdk";

const SYSTEM_PROMPT = `You are a helpful, friendly and conversational AI assistant. 
You respond in a warm, human-like way while being accurate and concise. 
You remember everything from the conversation history and refer back to it naturally.
If you don't know something, you admit it honestly.`;

// Store conversation history per user
const conversationHistory: Map<string, Array<{ role: "user" | "assistant"; content: string }>> = new Map();

export const askAI = async (prompt: string, userId: string): Promise<string> => {
    try {
        const client = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        // Get or create conversation history for this user
        if (!conversationHistory.has(userId)) {
            conversationHistory.set(userId, []);
        }

        const history = conversationHistory.get(userId)!;

        // Add user message to history
        history.push({ role: "user", content: prompt });

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...history,
            ],
        });

        const reply = response.choices[0].message.content ?? "No response from AI";

        // Add AI reply to history
        history.push({ role: "assistant", content: reply });

        // Keep history to last 20 messages to avoid token limits
        if (history.length > 20) {
            conversationHistory.set(userId, history.slice(-20));
        }

        return reply;
    } catch (error) {
        console.error("AI Service Error:", error);
        throw new Error("Failed to get response from AI");
    }
};

export const resetConversation = (userId: string): void => {
    conversationHistory.delete(userId);
};