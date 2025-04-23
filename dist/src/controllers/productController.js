"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const db_1 = require("../config/db");
const logger_1 = require("../utilities/logger");
const getProducts = async (_, res) => {
    try {
        const sql = "SELECT * FROM products";
        const [rows] = await db_1.db.query(sql);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "SELECT * FROM products WHERE id = ?";
        const [rows] = await db_1.db.query(sql, [id]);
        rows && rows.length > 0
            ? res.json(rows[0])
            : res.status(404).json({ message: "Product not found" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    const { name, description, price, stock, category, image } = req.body;
    try {
        const sql = `
      INSERT INTO products (name, description, price, stock, category, image) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        const params = [name, description, price, stock, category, image];
        const [result] = await db_1.db.query(sql, params);
        res.status(201).json({ message: "Product created", id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { name, description, price, stock, category, image } = req.body;
    try {
        const sql = `
      UPDATE products 
      SET name = ?, description = ?, price = ?, stock = ?, category = ?, image = ? 
      WHERE id = ?
    `;
        const params = [name, description, price, stock, category, image, id];
        const [result] = await db_1.db.query(sql, params);
        result.affectedRows === 0
            ? res.status(404).json({ message: "Product not found" })
            : res.json({ message: "Product updated" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "DELETE FROM products WHERE id = ?";
        const [result] = await db_1.db.query(sql, [id]);
        result.affectedRows === 0
            ? res.status(404).json({ message: "Product not found" })
            : res.json({ message: "Product deleted" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.deleteProduct = deleteProduct;
const searchProducts = async (req, res) => {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    if (!query) {
        return res.status(400).json({ error: "Sökterm saknas" });
    }
    try {
        const sql = `
      SELECT * FROM products 
      WHERE name LIKE ? OR category LIKE ?
      LIMIT ? OFFSET ?
    `;
        const wildcard = `%${query}%`;
        const [rows] = await db_1.db.query(sql, [wildcard, wildcard, limit, offset]);
        res.json({
            currentPage: page,
            results: rows,
            nextPage: `/products/search?q=${query}&page=${page + 1}&limit=${limit}`
        });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.searchProducts = searchProducts;
