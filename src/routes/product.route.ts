import { Router } from "express";
import { handelProductCreation } from "../controllers/product.controller";
// import { body } from "express-validator";

const productRouter:Router = Router({caseSensitive:true,strict:true})

productRouter.post('/add-product',handelProductCreation)




export {productRouter}