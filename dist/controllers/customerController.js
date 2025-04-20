import { db } from "../config/db";
import { logError } from "../utilities/logger";
// 🟢 Hämta alla kunder
export const getCustomers = async (_, res) => {
    try {
        const sql = "SELECT * FROM customers";
        const [rows] = await db.query(sql);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: logError(error) });
    }
};
// 🟢 Hämta kund via ID
export const getCustomerById = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "SELECT * FROM customers WHERE id = ?";
        const [rows] = await db.query(sql, [id]);
        rows && rows.length > 0
            ? res.json(rows[0])
            : res.status(404).json({ message: "Customer not found" });
    }
    catch (error) {
        res.status(500).json({ error: logError(error) });
    }
};
// 🟢 Hämta kund via e-post
export const getCustomerByEmail = async (req, res) => {
    const email = req.params.email;
    try {
        const sql = "SELECT * FROM customers WHERE email = ?";
        const [rows] = await db.query(sql, [email]);
        rows && rows.length > 0
            ? res.json(rows[0])
            : res.status(404).json({ message: "Customer not found" });
    }
    catch (error) {
        res.status(500).json({ error: logError(error) });
    }
};
// 🟢 Skapa ny kund
export const createCustomer = async (req, res) => {
    const { firstname, lastname, email, password, phone, street_address, postal_code, city, country, } = req.body;
    try {
        const sql = `
      INSERT INTO customers 
      (firstname, lastname, email, password, phone, street_address, postal_code, city, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await db.query(sql, [
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
        res.status(500).json({ error: logError(error) });
    }
};
// 🟡 Uppdatera kund
export const updateCustomer = async (req, res) => {
    const id = req.params.id;
    const { firstname, lastname, email, password, phone, street_address, postal_code, city, country, } = req.body;
    try {
        const sql = `
      UPDATE customers 
      SET firstname = ?, lastname = ?, email = ?, password = ?, phone = ?, street_address = ?, postal_code = ?, city = ?, country = ?
      WHERE id = ?
    `;
        const [result] = await db.query(sql, [
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
        res.status(500).json({ error: logError(error) });
    }
};
// 🔴 Radera kund
export const deleteCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "DELETE FROM customers WHERE id = ?";
        const [result] = await db.query(sql, [id]);
        result.affectedRows === 0
            ? res.status(404).json({ message: "Customer not found" })
            : res.json({ message: "Customer deleted" });
    }
    catch (error) {
        res.status(500).json({ error: logError(error) });
    }
};
