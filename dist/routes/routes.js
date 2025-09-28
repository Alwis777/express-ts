"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express_1 = require("express");
const greeting_route_1 = require("./greeting.route");
const customer_route_1 = require("./customer.route");
class Routes {
    static getInstance() {
        if (!Routes.instance) {
            Routes.instance = new Routes();
        }
        return Routes.instance;
    }
    constructor() {
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.use("/greeting", greeting_route_1.GreetingRoute.getInstance().router);
        this.router.use("/customer", customer_route_1.CustomerRoute.getInstance().router);
    }
}
exports.Routes = Routes;
