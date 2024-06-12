import { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import * as db from "../util/db";
import { QueryConfig } from "../types/queryConfigType";

export function handelSellerSignUp(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const { username, email, password } = matchedData(req);
        let saltRounds = 10;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            const queryConfig: QueryConfig = {
                text: `INSERT INTO bikridotcomschema.sellers(sellerName,email,password) VALUES($1, $2, $3)`,
                values: [username, email, hash],
            };
            db.query(queryConfig).then(function (value) {
                if (value.command === "INSERT") {
                    jwt.sign({ email }, "secret", {algorithm:'HS512', expiresIn: "15 days" }, (err, token) => {
                        if (!err) {
                            res.cookie("_token", token, {
                                httpOnly: true,
                                expires: new Date(Date.now() + 1296000000),
                                sameSite: "strict",
                            }).json({ success: true, msg: "signup successful!" });
                        } else {
                            next(err);
                        }
                    });
                }
            }).catch(function (error) {
                console.log({ error: error.message });
                next(error);
            });
        }).catch(function (error) {
            console.log(error);
            next(error);
        });
    } else {
        let errorMsg = result.array()[0].msg;
        let error = new Error(errorMsg);
        next(error);
    }
}

export function handelSellerSignin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const { email,password } = matchedData(req);
        const queryConfig:QueryConfig = {
            text:`SELECT sellername,email,password FROM bikridotcomschema.sellers WHERE email = $1`,
            values:[email],
        }
        db.query(queryConfig).then((result) => {
            if(result.command === 'SELECT'){
                const {sellername,password:hashedPassword} = result.rows[0];
                bcrypt.compare(password,hashedPassword,(err,isMatched) => {
                    if(!err && isMatched){
                        res.json({isMatched,sellername})
                    }else{
                        let error = err ? err : new Error("Password did not match")
                        next(error)
                    }
                })
            }
        }).catch((err) => {
            next(err);
        })
    } else {
        let errorMsg = result.array()[0].msg;
        let error = new Error(errorMsg);
        next(error);
    }
}

export function handelAuthorization(req:Request,res:Response,next:NextFunction){
    
}

/**
 * const {_token} = req.cookies;
                jwt.verify(_token,'secret',{algorithms:['HS512']},(err,value)=>{
                    res.json(value);
                })
 */