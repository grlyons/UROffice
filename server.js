require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Check if API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OpenAI API Key is missing! Set it in Render Environment Variables.");
  process.exit(1); // Stop server if no API key is found
}

app.post("/api/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-4", // Ensure this is a valid model
        prompt: prompt,
        max_tokens: 200,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ text: response.data.choices[0].text.trim() });

  } catch (error) {
    console.error("❌ Error generating text:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Internal Server Error. Check server logs." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
