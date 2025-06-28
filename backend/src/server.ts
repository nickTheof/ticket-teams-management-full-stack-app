import app from "@/app";
import mongoose from "mongoose";
import logger from "@/core/utils/logger";
import env_config from "@/core/configuration/config.env";

mongoose.connect(env_config.MONGODB_URI)
    .then(
        () => {
            logger.info("Mongo DB connection established");
            app.listen(env_config.PORT, () => {
                logger.info(`Server is up and running on port ${env_config.PORT}...`);
            });
        },
        (err) => {
            logger.error("Mongo DB Connection failed", err.message);
        }
    );