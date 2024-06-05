import { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { hash } from "bcrypt";

import * as db from "../util/db";
import { QueryConfig } from "../types/queryConfigType";

export async function handelSellerSignUp(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const { username, email, password } = matchedData(req);
        let saltRounds = 10;
        hash(password, saltRounds).then(function (hash) {
            const queryConfig: QueryConfig = {
                text: `INSERT INTO bikridotcomschema.sellers(sellerName,email,password) VALUES($1, $2, $3)`,
                values: [username, email, hash]
            };
            db.query(queryConfig).then(function (value) {
                res.json(value);
            }).catch(function (error) {
                console.log({ error: error.message });
                res.json(error);
            });
        }).catch(function (error) {
            console.log(error);
            next(error);
        });
    } else {
        // let errorMessage = 
        let errorMsg = result.array()[0].msg;
        let error = new Error(errorMsg);
        next(error);
    }
}
