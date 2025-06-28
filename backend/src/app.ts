import express, {Request, Response, NextFunction} from "express";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import env_config from "@/core/configuration/config.env";
import limiter from "@/middlewares/limiter";
import {AppObjectNotFoundError} from "@/core/errors/application.errors";
import errorHandler from "@/middlewares/errorHandler";

const app = express();


/**
 * Security Middlewares
 *
 * These middlewares are crucial for protecting the application from common web vulnerabilities.
 */

// Helmet helps secure Express apps by setting various HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// CORS configuration to restrict cross-origin requests
const ALLOWED_ORIGINS = env_config.ALLOWED_ORIGINS.split(",") || [];
app.use(
    cors({
        origin: ALLOWED_ORIGINS,
        credentials: true,
    })
);

/**
 * Request Processing Middlewares
 */

// Parse incoming requests with JSON payloads (limit: 10kb to prevent DOS attacks)
app.use(express.json({ limit: "10kb" }));
// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Protect against HTTP Parameter Pollution attacks
app.use(
    hpp({
        whitelist: [
            // Add parameters that should allow multiple values
        ],
    })
);

/**
 * Rate Limiting
 *
 * Apply rate limiting to all routes to prevent brute force attacks
 */
app.use("/", limiter);

/**
 * API Routes Setup with Dependency Injection
 *
 * This section retrieves route handlers from the DI container,
 * ensuring all dependencies are properly injected and managed.
 *
 * Routes are mounted with versioned API prefixes.
 */




/**
 * Catch-all Route Handler
 *
 * Handles requests to undefined routes with a 404 response
 */
app.all("/{*splat}", (req: Request, _res: Response, next: NextFunction) => {
    next(new AppObjectNotFoundError(`Uri`, `Can't find the ${req.originalUrl} on the server`));
});


/**
 * Error Handling Middleware
 *
 * This should be the last middleware to catch all errors
 */
app.use(errorHandler);

export default app;