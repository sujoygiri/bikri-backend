import { randomBytes } from "node:crypto";
import { } from "node:fs";
import { Request, Router } from "express";
import { body } from "express-validator";
import * as multer from "multer";

import { handelProductCreation } from "../controllers/product.controller";

const productRouter: Router = Router({ caseSensitive: true, strict: true });

const productImageStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {

        cb(null, 'public/product-images');
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueFileName = Date.now() + randomBytes(16).toString("hex");
        cb(null, uniqueFileName);
    }
});


const nameChain = () => body("name").trim().notEmpty().isAlphanumeric().withMessage("product name must not contain any special character");

const descriptionChain = () => body("description").isJSON();

const specificationChain = () => body("specification").trim().notEmpty();

const moreInfoChain = () => body("more_info").trim().notEmpty();

const priceChain = () => body("price").trim().notEmpty().escape().isLength({ max: 10, min: 1 }).withMessage("Price must not greater than 8 digits");

productRouter.post('/add-product', nameChain(), descriptionChain(), specificationChain(), moreInfoChain(), priceChain(), handelProductCreation);




export { productRouter, productImageStorage };