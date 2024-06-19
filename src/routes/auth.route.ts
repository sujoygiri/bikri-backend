import { Router } from "express";
import { body } from "express-validator";

import { handelUsersSignUp, handelUsersSignin } from "../controllers/auth.controller";

const authRouter: Router = Router({ caseSensitive: true, strict: true });

const createEmailChain = () => body("email").trim().notEmpty().escape().isEmail().withMessage("Invalid email id");
const createSellerNameChain = () => body("username").trim().notEmpty().escape().isLength({ min: 3 }).withMessage("Username must be 3 or more character long");
const createPasswordChain = () => body("password").trim().notEmpty().escape().isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage("Password must be 8 character long and contain 1 lowercase 1 uppercase 1 number 1 special character");

authRouter.post("/signup", createSellerNameChain(), createEmailChain(), createPasswordChain(), handelUsersSignUp);

authRouter.post("/signin", createEmailChain(), createPasswordChain(), handelUsersSignin);

export { authRouter };