import process from "node:process";
import winston from "winston";

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const {
      timestamp,
      level,
      message,
      ...args
    } = info;

    const ts = (timestamp as string).slice(0, 19).replace("T", " ");
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
    }`;
  }),
);

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      format: alignedWithColorsAndTime,
      level: process.env.NODE_ENV === "production" ? "error" : "info",
    }),
    new winston.transports.File({ filename: "debug.log", level: "debug" }),
  ],
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

export default logger;
