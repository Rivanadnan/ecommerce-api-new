"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController"); // ✅ du kan använda .ts lokalt – .js på Vercel
const router = express_1.default.Router();
router.get("/search", productController_1.searchProducts);
router.get("/", productController_1.getProducts);
router.get("/:id", productController_1.getProductById);
router.post("/", productController_1.createProduct);
router.patch("/:id", productController_1.updateProduct);
router.delete("/:id", productController_1.deleteProduct);
exports.default = router;
