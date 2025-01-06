"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("db/db"));
const express_1 = __importDefault(require("express"));
const PORT = process.env.AUTH_PORT || 5000;
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Хахахах!");
});
const start = () => {
    try {
        app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
    }
    catch (error) {
        console.error(error);
    }
};
start();
db_1.default;
