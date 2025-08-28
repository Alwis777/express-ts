"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send("Hello World");
});
router.post("/", (req, res) => {
    const { name } = req.body.name || "World";
    res.send(`Hello ${name}`);
}); //Postman? : Great for debugging your backend before connecting it to a frontend.
exports.default = router;
