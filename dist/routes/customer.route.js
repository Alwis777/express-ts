"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = require("express");
class CustomerRoute {
    static getInstance() {
        if (!CustomerRoute.instance) {
            CustomerRoute.instance = new CustomerRoute();
        }
        return CustomerRoute.instance;
    }
    constructor() {
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get("/", (req, res) => {
            res.send("Hello World");
        });
        this.router.post("/", (req, res) => {
            const { name } = req.body.name = req.body.name;
            res.send(`Hello ${name}`);
        });
    }
}
exports.CustomerRoute = CustomerRoute;
