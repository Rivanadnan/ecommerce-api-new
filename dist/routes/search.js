// src/routes/search.ts
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
router.get("/", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "No query provided" });
    }
    try {
        const { data } = await axios.get("https://www.googleapis.com/customsearch/v1", {
            params: {
                key: process.env.VITE_GOOGLE_API_KEY,
                cx: process.env.VITE_GOOGLE_SEARCH_ENGINE_ID,
                q: query,
            },
        });
        res.json(data.items);
    }
    catch (error) {
        console.error("Google Search Error:", error);
        res.status(500).json({ error: "Failed to fetch search results" });
    }
});
export default router;
