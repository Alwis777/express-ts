import { Response } from "express";
import { HttpStatus } from "./constants/httpStatus.enum";

export const successResponse = (code:HttpStatus,response:Response, data:any , alreadyWrappedWithData: boolean = false ) => {
    let responseData = alreadyWrappedWithData ? data : { data };
    response.status(code).json(responseData); // Wrap data in an object with a 'data' key
     
}

export const errorResponse = (code:HttpStatus,response:Response, error:any, alreadyWrappedWithError: boolean = false) => {
    let errorData = alreadyWrappedWithError ? error : { error };
    response.status(code).json(errorData); // Wrap error in an object with an 'error' key
}
    
    

