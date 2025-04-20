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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const router = express_1.default.Router();
// 🔐 POST /auth/register
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ error: "Namn, e-post och lösenord krävs" });
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const [result] = yield db_1.db.query("INSERT INTO customers (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
        const token = jsonwebtoken_1.default.sign({ id: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(201).json({ token });
    }
    catch (err) {
        console.error("❌ Fel vid registrering:", err);
        res.status(500).json({ error: "Något gick fel vid registrering" });
    }
}));
// 🔐 POST /auth/login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const [rows] = yield db_1.db.query("SELECT * FROM customers WHERE email = ?", [email]);
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ error: "Användare hittades inte" });
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Felaktigt lösenord" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token });
    }
    catch (err) {
        console.error("❌ Fel vid inloggning:", err);
        res.status(500).json({ error: "Inloggning misslyckades" });
    }
}));
exports.default = router;
