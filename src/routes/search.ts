// src/routes/search.ts
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.q as string;
  const page = parseInt(req.query.page as string) || 1;
  const startIndex = (page - 1) * 10 + 1; // varje sida visar 10 resultat

  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }

  try {
    const { data } = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key: process.env.VITE_GOOGLE_API_KEY,
        cx: process.env.VITE_GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        start: startIndex,
      },
    });

    res.json({
      items: data.items,
      totalResults: data.searchInformation?.totalResults,
      currentPage: page,
    });
  } catch (error: any) {
    console.error("Google Search Error:", error.message);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

export default router;
