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
exports.deleteOrderItem = exports.updateOrderItem = void 0;
const db_1 = require("../config/db");
const logger_1 = require("../utilities/logger");
const updateOrderItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { quantity } = req.body;
    if (quantity <= 0) {
        res.status(400).json({ message: 'Quantity must be greater than 0' });
        return;
    }
    try {
        const sql = `
      UPDATE order_items
      SET 
        quantity = ?
      WHERE id = ?
    `;
        const params = [quantity, id];
        const [result] = yield db_1.db.query(sql, params);
        const [rows] = yield db_1.db.query("SELECT * FROM order_items WHERE id = ?", [id]);
        yield updateOrderTotalPrice(rows[0].order_id);
        console.log(rows[0].order_id);
        result.affectedRows === 0
            ? res.status(404).json({ message: 'Order item not found' })
            : res.json({ message: 'Order item updated' });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.updateOrderItem = updateOrderItem;
const deleteOrderItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const [rows] = yield db_1.db.query("SELECT * FROM order_items WHERE id = ?", [id]);
        const sql = "DELETE FROM order_items WHERE id = ?";
        const [result] = yield db_1.db.query(sql, [id]);
        yield updateOrderTotalPrice(rows[0].order_id);
        result.affectedRows === 0
            ? res.status(404).json({ message: 'Order item not found' })
            : res.json({ message: 'Order item deleted' });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
});
exports.deleteOrderItem = deleteOrderItem;
const updateOrderTotalPrice = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `
      UPDATE orders
      SET total_price = (
        SELECT COALESCE(SUM(unit_price * quantity),0) 
        FROM order_items 
        WHERE order_id = ?
      )
      WHERE id = ?
    `;
        const params = [order_id, order_id];
        yield db_1.db.query(sql, params);
    }
    catch (error) {
        throw new Error;
    }
});
