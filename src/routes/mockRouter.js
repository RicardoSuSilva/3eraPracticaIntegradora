import { Router } from "express";
//import passport from "passport";
import { generateRandomProducts } from "../controllers/productController.js";
import { generateRandomUsers } from "../controllers/userController.js";

const mockRouter = Router();

mockRouter.get('/mockingproducts', generateRandomProducts)

mockRouter.get('/mockingusers', generateRandomUsers)

export default mockRouter
