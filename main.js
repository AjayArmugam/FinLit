const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// System message to ensure bot acts as a financial assistant
const SYSTEM_MESSAGE = "You are a financial literacy expert. Provide clear and practical financial advice in simple terms. Only answer questions about saving, investing, budgeting, debt management, and financial planning. If the question is unrelated to finance, politely refuse to answer."

// Function to generate AI response
const generateResponse = async (userInput) => {
    try {
        const prompt = `${SYSTEM_MESSAGE}\n\nUser: ${userInput}\nBot:`;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("Error generating response:", err);
        return "Sorry, I couldn't process your request.";
    }
};

// API Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const userQuestion = req.body.question;
        if (!userQuestion) {
            return res.status(400).json({ error: "Question is required" });
        }

        const botResponse = await generateResponse(userQuestion);
        res.json({ result: botResponse });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Server error, please try again later." });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});