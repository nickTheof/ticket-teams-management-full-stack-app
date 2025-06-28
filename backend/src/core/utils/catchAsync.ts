import { NextFunction, Request, Response } from 'express';

/**
 * Wraps an async route handler to catch errors and pass them to next() middleware.
 * This helps avoid repetitive try-catch blocks in every async controller function.
 *
 * @param fn - Async function with (req, res, next) signature
 * @returns A function that handles errors by forwarding them to Express error middleware
 */
export default function catchAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next); // catch any rejection and forward to error handler
    };
}