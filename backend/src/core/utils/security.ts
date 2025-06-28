import env_config from "@/core/configuration/config.env";
import bcrypt from "bcrypt";
import * as crypto from "node:crypto";

/**
 *  Hash a plain text password using bcrypt with salt rounds from env config.
 * @param password - The plain password to hash.
 * @returns The hashed password.
 */
const hashPassword = async(password: string) => {
    const salt = await bcrypt.genSalt(env_config.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password.
 * @param plainPassword - The plain text password to verify.
 * @param storedPassword - The hashed password to compare against.
 * @returns True if passwords match, false otherwise.
 */
const comparePassword = (plainPassword: string, storedPassword: string) => {
    return bcrypt.compare(plainPassword, storedPassword);
}

/**
 * Generate a secure verification token hashed with SHA-256.
 * @returns A hashed verification token.
 */
const generateVerificationToken = () => {
    const verificationToken = crypto.randomBytes(64).toString("hex");
    return crypto.createHash("sha256").update(verificationToken).digest("hex");
}

/**
 * Generate a secure reset password token hashed with SHA-256.
 * @returns A hashed reset password token.
 */
const generateResetPasswordToken = () => {
    const resetToken = crypto.randomBytes(64).toString("hex");
    return crypto.createHash("sha256").update(resetToken).digest("hex");
}

/**
 * Generate a secure enable user token hashed with SHA-256.
 * @returns A hashed enable user token.
 */
const generateEnableUserToken = () => {
    const enableUserToken = crypto.randomBytes(64).toString("hex");
    return crypto.createHash("sha256").update(enableUserToken).digest("hex");
}

export {
    hashPassword,
    comparePassword,
    generateVerificationToken,
    generateResetPasswordToken,
    generateEnableUserToken,
}