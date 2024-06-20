import { Request,Response,NextFunction } from "express";
import { NewError } from "../types/typesAndInterfaces";
export function handelError(err:NewError,req:Request,res:Response,next:NextFunction){
    res.json({err:err})
    
}