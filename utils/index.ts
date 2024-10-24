import process from "node:process";
import winston from "winston";

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "error" : "debug",
    }),
    new winston.transports.File({ filename: "debug.log", level: "debug" }),
  ],
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

export default logger;

function toCamelCase(snakeStr: string): string {
    return snakeStr.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Function to transform JSON object keys to camelCase
function transformKeysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(item => transformKeysToCamelCase(item));
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            const camelCaseKey = toCamelCase(key);
            acc[camelCaseKey] = transformKeysToCamelCase(obj[key]);
            return acc;
        }, {} as any);
    }
    return obj; // If it's not an object or array, return the value as-is
}