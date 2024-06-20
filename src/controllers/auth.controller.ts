import { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import * as db from "../util/db";
import { NewError, PayLoad, QueryConfig } from "../types/typesAndInterfaces";

export function handelSellerSignUp(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const { sellername, email, password } = matchedData(req);
        let saltRounds: number | string = 10;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            const queryConfig: QueryConfig = {
                text: `INSERT INTO bikridotcomschema.sellers(sellername,email,password) VALUES($1, $2, $3)`,
                values: [sellername, email, hash],
            };
            db.query(queryConfig).then(function () {
                jwt.sign({ sellername, email }, process.env.JWT_SECRET as string, { algorithm: 'HS512', expiresIn: "1296000000" }, (err, token) => {
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
        const { email, password } = matchedData(req);
        const queryConfig: QueryConfig = {
            text: `SELECT sellername,email,password FROM bikridotcomschema.sellers WHERE email = $1`,
            values: [email],
        };
        db.query(queryConfig).then((result) => {
            if (result.rows.length) {
                const { sellername, email, password: hashedPassword } = result.rows[0];
                bcrypt.compare(password, hashedPassword, (err, isMatched) => {
                    if (!err && isMatched) {
                        jwt.sign({ sellername, email }, process.env.JWT_SECRET as string, { algorithm: 'HS512', expiresIn: "1296000000" }, (err, token) => {
                            if (!err) {
                                res.cookie("_token", token, {
                                    httpOnly: true,
                                    expires: new Date(Date.now() + 1296000000),
                                    sameSite: "strict",
                                }).json({ success: true, msg: "signin successful!", sellername });
                            } else {
                                next(err);
                            }
                        });
                    } else {
                        let error = err ? err : new Error("Password did not match");
                        next(error);
                    }
                });
            } else {
                let error = new Error("Email id not found.");
                next(error);
            }
        }).catch((err) => {
            next(err);
        });
    } else {
        let errorMsg = result.array()[0].msg;
        let error = new Error(errorMsg);
        next(error);
    }
}

export function handelAuthorization(req: Request, res: Response, next: NextFunction) {
    let jwtToken = req.cookies['_token'];
    if (jwtToken) {
        jwt.verify(jwtToken, process.env.JWT_SECRET as string, { algorithms: ['HS512'] }, (err, payload) => {
            if (!err) {
                let { sellername } = payload as PayLoad;
                return res.cookie("_token", jwtToken, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 1296000000),
                    sameSite: "strict",
                }).json({ success: true, msg: 'Verify successful', sellername });
            } else if (err.name === 'TokenExpiredError') {
                let { sellername, email } = jwt.decode(jwtToken, { json: true }) as PayLoad;
                jwt.sign({ sellername, email }, process.env.JWT_SECRET as string, { algorithm: 'HS512', expiresIn: Date.now() + 1296000000 }, (err, token) => {
                    if (!err) {
                        res.cookie("_token", token, {
                            httpOnly: true,
                            expires: new Date(Date.now() + 1296000000),
                            sameSite: "strict",
                        }).json({ success: true, msg: "Verify successful", sellername });
                    } else {
                        next(err);
                    }
                });
            } else {
                next(err);
            }
        });

    } else {
        let error: NewError = {
            name: 'token error',
            message: 'token not found',
            statusCode: 404
        };
        next(error);
    }
}

/**
 * const {_token} = req.cookies;
                jwt.verify(_token,'secret',{algorithms:['HS512']},(err,value)=>{
                    res.json(value);
                })
 */
