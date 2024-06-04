import { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";

async function handelSellerSignUp(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const validatedData = matchedData(req);
        return res.json(validatedData);
    }
    // let errorMessage = 
    res.json(result);
}



module.exports = {
    handelSellerSignUp
};