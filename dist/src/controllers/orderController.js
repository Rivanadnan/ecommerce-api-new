"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.updateOrderBySessionId = exports.getOrderBySessionId = exports.getOrderById = exports.getOrders = void 0;
const db_1 = require("../config/db");
const logger_1 = require("../utilities/logger");
// 🔹 GET ALL ORDERS
const getOrders = async (_, res) => {
    try {
        const sql = `
      SELECT 
        orders.id AS id, 
        customer_id,
        total_price,
        payment_status,
        payment_id,
        order_status,
        orders.created_at,
        customers.id AS customer_id, 
        firstname AS customer_firstname, 
        lastname AS customer_lastname, 
        email AS customer_email, 
        phone AS customer_phone,
        street_address AS customer_street_address,
        postal_code AS customer_postal_code,
        city AS customer_city,
        country AS customer_country,
        customers.created_at AS customers_created_at
      FROM orders
      LEFT JOIN customers ON orders.customer_id = customers.id`;
        const [rows] = await db_1.db.query(sql);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.getOrders = getOrders;
// 🔹 GET ORDER BY ID
const getOrderById = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = `
      SELECT *, 
        orders.id AS order_id,
        orders.created_at AS orders_created_at, 
        customers.created_at AS customers_created_at 
      FROM orders 
      LEFT JOIN customers ON orders.customer_id = customers.id
      LEFT JOIN order_items ON orders.id = order_items.order_id
      WHERE orders.id = ?
    `;
        const [rows] = await db_1.db.query(sql, [id]);
        rows && rows.length > 0
            ? res.json(formatOrderDetails(rows))
            : res.status(404).json({ message: "Order not found" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.getOrderById = getOrderById;
// 🔹 GET ORDER BY SESSION ID
const getOrderBySessionId = async (req, res) => {
    const session_id = req.params.session_id;
    try {
        const sql = `
      SELECT *, 
        orders.id AS order_id,
        orders.created_at AS orders_created_at, 
        customers.created_at AS customers_created_at 
      FROM orders 
      LEFT JOIN customers ON orders.customer_id = customers.id
      LEFT JOIN order_items ON orders.id = order_items.order_id
      WHERE orders.payment_id = ?
    `;
        const [rows] = await db_1.db.query(sql, [session_id]);
        rows && rows.length > 0
            ? res.json(formatOrderDetails(rows))
            : res.status(404).json({ message: "Order not found" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.getOrderBySessionId = getOrderBySessionId;
// 🔹 UPDATE ORDER BY SESSION ID
const updateOrderBySessionId = async (req, res) => {
    const session_id = req.params.session_id;
    const { payment_status, order_status } = req.body;
    try {
        const sql = `
      UPDATE orders 
      SET payment_status = ?, order_status = ?
      WHERE payment_id = ?
    `;
        const params = [payment_status, order_status, session_id];
        const [result] = await db_1.db.query(sql, params);
        result.affectedRows === 0
            ? res.status(404).json({ message: "Order not found" })
            : res.json({ message: "Order updated" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.updateOrderBySessionId = updateOrderBySessionId;
// 🔹 FORMAT ORDER
const formatOrderDetails = (rows) => ({
    id: rows[0].order_id,
    customer_id: rows[0].customer_id,
    total_price: rows[0].total_price,
    payment_status: rows[0].payment_status,
    payment_id: rows[0].payment_id,
    order_status: rows[0].order_status,
    created_at: rows[0].orders_created_at,
    customer_firstname: rows[0].firstname,
    customer_lastname: rows[0].lastname,
    customer_email: rows[0].email,
    customer_password: rows[0].password,
    customer_phone: rows[0].phone,
    customer_street_address: rows[0].street_address,
    customer_postal_code: rows[0].postal_code,
    customer_city: rows[0].city,
    customer_country: rows[0].country,
    order_items: rows[0].id
        ? rows.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
        }))
        : [],
});
// 🔹 CREATE ORDER
const createOrder = async (req, res) => {
    const { customer_id, payment_status, payment_id, order_status } = req.body;
    try {
        const sql = `
      INSERT INTO orders (customer_id, total_price, payment_status, payment_id, order_status)
      VALUES (?, ?, ?, ?, ?)
    `;
        const totalPrice = req.body.order_items.reduce((total, item) => total + item.quantity * item.unit_price, 0);
        const params = [customer_id, totalPrice, payment_status, payment_id, order_status];
        const [result] = await db_1.db.query(sql, params);
        if (result.insertId) {
            const order_id = result.insertId;
            const orderItems = req.body.order_items;
            for (const orderItem of orderItems) {
                const data = { ...orderItem, order_id };
                await createOrderItem(data);
            }
        }
        res.status(201).json({ message: "Order created", id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.createOrder = createOrder;
// 🔹 CREATE ORDER ITEM
const createOrderItem = async (data) => {
    const { order_id, product_id, product_name, quantity, unit_price } = data;
    try {
        const sql = `
      INSERT INTO order_items (
        order_id, 
        product_id, 
        product_name, 
        quantity, 
        unit_price 
      ) VALUES (?, ?, ?, ?, ?)
    `;
        const params = [order_id, product_id, product_name, quantity, unit_price];
        await db_1.db.query(sql, params);
    }
    catch (error) {
        throw new Error();
    }
};
// 🔹 UPDATE ORDER BY ID
const updateOrder = async (req, res) => {
    const id = req.params.id;
    const { payment_status, payment_id, order_status } = req.body;
    try {
        const sql = `
      UPDATE orders 
      SET payment_status = ?, payment_id = ?, order_status = ?
      WHERE id = ?
    `;
        const params = [payment_status, payment_id, order_status, id];
        const [result] = await db_1.db.query(sql, params);
        result.affectedRows === 0
            ? res.status(404).json({ message: "Order not found" })
            : res.json({ message: "Order updated" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.updateOrder = updateOrder;
// 🔹 DELETE ORDER
const deleteOrder = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "DELETE FROM orders WHERE id = ?";
        const [result] = await db_1.db.query(sql, [id]);
        result.affectedRows === 0
            ? res.status(404).json({ message: "Order not found" })
            : res.json({ message: "Order deleted" });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.deleteOrder = deleteOrder;
