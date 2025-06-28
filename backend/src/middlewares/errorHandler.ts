import logger from '../core/utils/logger';
import { Request, Response, NextFunction } from 'express';
import {z} from 'zod/v4';
import mongoose from 'mongoose';
import {MongoServerError, MongoNetworkError, MongoNetworkTimeoutError} from "mongodb";
import {
    AppGenericError,
    AppObjectAlreadyExistsError, AppObjectForbiddenError,
    AppObjectInvalidArgumentError, AppObjectNotAuthorizedError,
    AppObjectNotFoundError, AppServerError, AppValidationError
} from "@/core/errors/application.errors";

// Helper method for unified errors
const sendAppErrorResponse = (err: AppGenericError, code: number, res: Response) => {
    logger.warn(`[${err.getCode()}] ${err.message} ${err.stack}`);
    return res.status(code).json({
        code: err.getCode(),
        message: err.message
    });
};

const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof AppObjectNotFoundError) {
        sendAppErrorResponse(err, 404, res);
        return;
    }
    if (err instanceof AppObjectAlreadyExistsError) {
        sendAppErrorResponse(err, 409, res);
        return;
    }
    if (err instanceof AppObjectInvalidArgumentError) {
        sendAppErrorResponse(err, 400, res);
        return;
    }
    if (err instanceof AppObjectNotAuthorizedError) {
        sendAppErrorResponse(err, 401, res);
        return;
    }
    if (err instanceof AppObjectForbiddenError) {
        sendAppErrorResponse(err, 403, res);
        return;
    }
    if (err instanceof AppServerError) {
        logger.error(`[${err.getCode()}] ${err.message}`, { stack: err.stack });
        sendAppErrorResponse(err, 500, res);
        return;
    }

    // Zod validation error
    if (err instanceof AppValidationError) {
        const {formErrors, fieldErrors} = z.flattenError(err.zodError);
        logger.warn(`[ValidationError] ${err.message}`, { fieldErrors, formErrors });
        res.status(400).json({
            code: err.code,
            message: err.message,
            fieldErrors,
            formErrors
        });
        return;
    }

    //Handle MongoDB Errors if we fail to catch them in the service layer
    if (err instanceof MongoServerError) {
        if (err.code === 11000) {
            sendAppErrorResponse(new AppObjectAlreadyExistsError("Object", "Duplicate value for unique field"), 409, res)
            return;
        }
    }
    if (err instanceof MongoNetworkError || err instanceof MongoNetworkTimeoutError) {
        sendAppErrorResponse(new AppServerError("MongoDbServiceUnavailable", "Error connecting to mongo db server"), 503, res)
        return;
    }
    //Handle Mongoose Errors
    if (err instanceof mongoose.Error.ValidationError) {
        logger.error(err.stack);
        sendAppErrorResponse(new AppObjectInvalidArgumentError(
            "Object",
            "Validation failed for one or more fields"
        ), 400, res)
        return;
    }

    if (err instanceof mongoose.Error.CastError) {
        sendAppErrorResponse(new AppObjectInvalidArgumentError(
            "Object",
            "Invalid identifier or value for field"
        ), 400, res)
        return;
    }


    // Standard JS Error
    if (err instanceof Error) {
        logger.error(`[InternalServerError] ${err.message}`, { stack: err.stack });
        res.status(500).json({
            code: "InternalServerError",
            message: err.message
        });
        return;
    }

    // Fallback for unknown errors
    logger.error(`[UnknownError]`, { err });
    res.status(500).json({
        code: "InternalServerError",
        message: "An unknown error occurred"
    });
};

export default errorHandler;
