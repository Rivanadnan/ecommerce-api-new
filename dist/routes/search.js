"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "No query provided" });
    }
    try {
        const { data } = yield axios_1.default.get("https://www.googleapis.com/customsearch/v1", {
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
}));
exports.default = router;
