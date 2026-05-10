import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve("credentials.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = "1lb18pxBhs1aix6D5dXfqt7nMy5JmXbD-Vlz_5KO2ft4";

export const logMessage = async (
    userMessage: string,
    aiReply: string
): Promise<void> => {
    try {
        const sheets = google.sheets({ version: "v4", auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Sheet1!A:C",
            valueInputOption: "RAW",
            requestBody: {
                values: [[new Date().toLocaleString(), userMessage, aiReply]],
            },
        });
    } catch (error) {
        console.error("Google Sheets Error:", error);
        throw new Error("Failed to log message to Google Sheets");
    }
};

export const getLogs = async (): Promise<any[]> => {
    try {
        const sheets = google.sheets({ version: "v4", auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Sheet1!A:C",
        });

        const rows = response.data.values || [];

        // Skip the header row and format the data
        return rows.slice(1).map((row) => ({
            timestamp: row[0],
            userMessage: row[1],
            aiReply: row[2],
        }));
    } catch (error) {
        console.error("Google Sheets Error:", error);
        throw new Error("Failed to fetch logs from Google Sheets");
    }
};