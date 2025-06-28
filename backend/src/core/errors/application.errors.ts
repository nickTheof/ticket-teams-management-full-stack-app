import {ZodError} from 'zod/v4';

export class AppGenericError extends Error {
    private readonly code: string;
    constructor(code: string, message: string) {
        super(message);
        this.code = code;
        this.name = new.target.name; // Sets the name property of the error instance to the actual class name that was used with new
        Object.setPrototypeOf(this, new.target.prototype); // Ensure instanceof works
    }
    getCode(): string {
        return this.code;
    }
}

export class AppObjectNotFoundError extends AppGenericError {
    public static readonly DEFAULT_NAME = 'NotFound';
    constructor(code: string, message: string) {
        super(`${code}${AppObjectNotFoundError.DEFAULT_NAME}`, message);
    }
}

export class AppObjectAlreadyExistsError extends AppGenericError {
    public static readonly DEFAULT_NAME = 'AlreadyExists';
    constructor(code: string, message: string) {
        super(`${code}${AppObjectAlreadyExistsError.DEFAULT_NAME}`, message);
    }
}

export class AppObjectNotAuthorizedError extends AppGenericError {
    public static readonly DEFAULT_NAME = 'NotAuthorized';
    constructor(code: string, message: string) {
        super(`${code}${AppObjectNotAuthorizedError.DEFAULT_NAME}`, message);
    }
}

export class AppObjectForbiddenError extends AppGenericError {
    public static readonly DEFAULT_NAME = 'Forbidden';
    constructor(code: string, message: string) {
        super(`${code}${AppObjectForbiddenError.DEFAULT_NAME}`, message);
    }
}

export class AppObjectInvalidArgumentError extends AppGenericError {
    public static readonly DEFAULT_NAME = 'InvalidArgument';
    constructor(code: string, message: string) {
        super(`${code}${AppObjectInvalidArgumentError.DEFAULT_NAME}`, message);
    }
}

export class AppServerError extends AppGenericError {
    constructor(code: string, message: string) {
        super(code, message);
    }
}

export class AppValidationError extends Error {
    public readonly zodError: ZodError;
    public readonly code = "ValidationError";
    constructor(message: string, zodError: ZodError) {
        super(message + "ValidationException");
        this.name = new.target.name;
        this.zodError = zodError;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
