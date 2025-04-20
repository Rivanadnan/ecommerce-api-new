import express from "express";
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomerByEmail } from "../controllers/customerController";
const router = express.Router();
// 🟢 GET alla kunder
router.get("/", getCustomers);
// 🟢 GET kund via e-post (måste komma innan :id)
router.get("/email/:email", getCustomerByEmail);
// 🟢 GET kund via ID
router.get("/:id", getCustomerById);
// 🟢 POST skapa ny kund
router.post("/", createCustomer);
// 🟡 PATCH uppdatera kund
router.patch("/:id", updateCustomer);
// 🔴 DELETE radera kund
router.delete("/:id", deleteCustomer);
export default router;
