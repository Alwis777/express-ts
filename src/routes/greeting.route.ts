import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

router.post("/", (req: Request, res: Response) => {
  const { name } = req.body.name = req.body.name;
  res.send(`Hello ${name}`);
});
  //Postman? : Great for debugging your backend before connecting it to a frontend.

 export default router;
