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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const db_1 = require("../config/db");
const logger_1 = require("../utilities/logger");
const getProducts = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = "SELECT * FROM products";
        const [rows] = yield db_1.db.query(sql);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const sql = "SELECT * FROM products WHERE id = ?";
        const [rows] = yield db_1.db.query(sql, [id]);
        rows && rows.length > 0
            ? res.json(rows[0])
            : res.status(404).json({ message: "Product not found" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, stock, category, image } = req.body;
    try {
        const sql = `
      INSERT INTO products (name, description, price, stock, category, image) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        const params = [name, description, price, stock, category, image];
        const [result] = yield db_1.db.query(sql, params);
        res.status(201).json({ message: "Product created", id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, description, price, stock, category, image } = req.body;
    try {
        const sql = `
      UPDATE products 
      SET name = ?, description = ?, price = ?, stock = ?, category = ?, image = ? 
      WHERE id = ?
    `;
        const params = [name, description, price, stock, category, image, id];
        const [result] = yield db_1.db.query(sql, params);
        result.affectedRows === 0
            ? res.status(404).json({ message: "Product not found" })
            : res.json({ message: "Product updated" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const sql = "DELETE FROM products WHERE id = ?";
        const [result] = yield db_1.db.query(sql, [id]);
        result.affectedRows === 0
            ? res.status(404).json({ message: "Product not found" })
            : res.json({ message: "Product deleted" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.deleteProduct = deleteProduct;
