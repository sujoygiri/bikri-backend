import { Router } from "express";
import { body } from "express-validator";

const authRouter: Router = Router({ caseSensitive: true, strict: true });

const createEmailChain = () => body("email").trim().notEmpty().escape().isEmail();
const createSellerNameChain = () => body("name").trim().notEmpty().escape();
const createPasswordChain = () => body("password").trim().notEmpty().escape().isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 });

authRouter.post("/signup", createSellerNameChain(), createEmailChain(), createPasswordChain());

export { authRouter };