"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/search.ts
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * 10 + 1; // varje sida visar 10 resultat
    if (!query) {
        return res.status(400).json({ error: "No query provided" });
    }
    try {
        const { data } = await axios_1.default.get("https://www.googleapis.com/customsearch/v1", {
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
    }
    catch (error) {
        console.error("Google Search Error:", error.message);
        res.status(500).json({ error: "Failed to fetch search results" });
    }
});
exports.default = router;
