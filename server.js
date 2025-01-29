// Load environment variables from a .env file
require("dotenv").config();

// Import necessary packages
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Initialize the express app
const app = express();

// Apply CORS headers globally for all routes
app.use(cors({
  origin: 'https://uroffices.com',  // Allow only requests from the specified website
  methods: ['GET', 'POST'],        // Allow GET and POST HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

// Middleware to parse incoming JSON data
app.use(express.json());

// Handle POST request to generate text using OpenAI API
app.post("/api/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;  // Get the prompt text from the request body

    // Call OpenAI API to generate text based on the prompt
    const response = await axios.post(
      "https://api.openai.com/v1/completions", // OpenAI API URL
      {
        model: "gpt-4",  // Use GPT-4 model for text generation
        prompt: prompt,  // Send the user's prompt to OpenAI
        max_tokens: 200, // Limit the response to 200 tokens
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,  // Include OpenAI API key from .env
          "Content-Type": "application/json",  // Set content type to JSON
        },
      }
    );

    // Send the generated text as a JSON response
    res.json({ text: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error("Error generating text:", error);  // Log any error that occurs
    res.status(500).json({ error: "Something went wrong!" });  // Send an error response
  }
});

// Set the port for the server to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  // Start the server
