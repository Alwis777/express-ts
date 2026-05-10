import Groq from "groq-sdk";

const SYSTEM_PROMPT = `You are a helpful, friendly and conversational AI assistant. 
You respond in a warm, human-like way while being accurate and concise. 
If you don't know something, you admit it honestly.`;

export const askAI = async (prompt: string): Promise<string> => {
    try {
        const client = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        return response.choices[0].message.content ?? "No response from AI";
    } catch (error) {
        console.error("AI Service Error:", error);
        throw new Error("Failed to get response from AI");
    }
};