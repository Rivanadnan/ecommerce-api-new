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
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomerByEmail = exports.getCustomerById = exports.getCustomers = void 0;
const db_1 = require("../config/db");
const logger_1 = require("../utilities/logger");
// 🟢 Hämta alla kunder
const getCustomers = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = "SELECT * FROM customers";
        const [rows] = yield db_1.db.query(sql);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.getCustomers = getCustomers;
// 🟢 Hämta kund via ID
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const sql = "SELECT * FROM customers WHERE id = ?";
        const [rows] = yield db_1.db.query(sql, [id]);
        rows && rows.length > 0
            ? res.json(rows[0])
            : res.status(404).json({ message: "Customer not found" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.getCustomerById = getCustomerById;
// 🟢 Hämta kund via e-post
const getCustomerByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    try {
        const sql = "SELECT * FROM customers WHERE email = ?";
        const [rows] = yield db_1.db.query(sql, [email]);
        rows && rows.length > 0
            ? res.json(rows[0])
            : res.status(404).json({ message: "Customer not found" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.getCustomerByEmail = getCustomerByEmail;
// 🟢 Skapa ny kund
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password, phone, street_address, postal_code, city, country, } = req.body;
    try {
        const sql = `
      INSERT INTO customers 
      (firstname, lastname, email, password, phone, street_address, postal_code, city, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = yield db_1.db.query(sql, [
            firstname,
            lastname,
            email,
            password,
            phone,
            street_address,
            postal_code,
            city,
            country,
        ]);
        res.status(201).json({ message: "Customer created", id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.createCustomer = createCustomer;
// 🟡 Uppdatera kund
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { firstname, lastname, email, password, phone, street_address, postal_code, city, country, } = req.body;
    try {
        const sql = `
      UPDATE customers 
      SET firstname = ?, lastname = ?, email = ?, password = ?, phone = ?, street_address = ?, postal_code = ?, city = ?, country = ?
      WHERE id = ?
    `;
        const [result] = yield db_1.db.query(sql, [
            firstname,
            lastname,
            email,
            password,
            phone,
            street_address,
            postal_code,
            city,
            country,
            id,
        ]);
        result.affectedRows === 0
            ? res.status(404).json({ message: "Customer not found" })
            : res.json({ message: "Customer updated" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.updateCustomer = updateCustomer;
// 🔴 Radera kund
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const sql = "DELETE FROM customers WHERE id = ?";
        const [result] = yield db_1.db.query(sql, [id]);
        result.affectedRows === 0
            ? res.status(404).json({ message: "Customer not found" })
            : res.json({ message: "Customer deleted" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.deleteCustomer = deleteCustomer;
