import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const askAI = async (prompt: string): Promise<string> => {
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    return response.choices[0].message.content ?? "No response from AI";
};