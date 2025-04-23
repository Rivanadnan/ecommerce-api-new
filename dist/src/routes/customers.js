"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const router = express_1.default.Router();
// 🟢 GET alla kunder
router.get("/", customerController_1.getCustomers);
// 🟢 GET kund via e-post (måste komma innan :id)
router.get("/email/:email", customerController_1.getCustomerByEmail);
// 🟢 GET kund via ID
router.get("/:id", customerController_1.getCustomerById);
// 🟢 POST skapa ny kund
router.post("/", customerController_1.createCustomer);
// 🟡 PATCH uppdatera kund
router.patch("/:id", customerController_1.updateCustomer);
// 🔴 DELETE radera kund
router.delete("/:id", customerController_1.deleteCustomer);
exports.default = router;
