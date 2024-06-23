import { NextFunction, Request, Response } from "express";
import { NewError } from "../types/typesAndInterfaces";
// import { validationResult } from "express-validator";

export function handelProductCreation(req: Request, res: Response, next: NextFunction) {
    // const result = validationResult(req);
    // res.json(result);
    try {

        res.json(req.body);

    } catch (error) {
        console.log(error);

        let err: NewError = {
            name: '',
            message: '',
            statusCode: 404
        };
        next(err);

    }
}