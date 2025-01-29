require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({ origin: "*" })); // Allow all origins
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Debugging: Log API Key (Remove this after testing)
console.log("OpenAI API Key:", OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌");

app.post("/api/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
    if (!OPENAI_API_KEY) {
      console.error("🚨 Missing OpenAI API Key!");
      return res.status(500).json({ error: "Server is missing OpenAI API Key" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-4",
        prompt: prompt,
        max_tokens: 200,
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || !response.data.choices) {
      return res.status(500).json({ error: "Invalid response from OpenAI" });
    }

    res.json({ text: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error("Error generating text:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Something went wrong on the server!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
