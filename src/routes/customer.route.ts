import { Router, Request, Response } from "express";

export class CustomerRoute {
    private static instance: CustomerRoute;
    public router:Router;

    public static getInstance():CustomerRoute{
        if(!CustomerRoute.instance){
            CustomerRoute.instance = new CustomerRoute();
        }
        
        return CustomerRoute.instance;
    }

    private constructor(){
        this.router = Router();
        this.setupRoutes();     
    }

    private setupRoutes(){
        this.router.get("/", (req: Request, res: Response) => {
            res.send("Hello World Customer"); 
        });
    
        this.router.post("/", (req: Request, res: Response) => {
            const { name } = req.body.name = req.body.name;
            res.send(`Hello ${name}`);
        });  
    }
}

