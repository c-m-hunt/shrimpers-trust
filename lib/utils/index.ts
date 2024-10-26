import process from "node:process";
import winston from "winston";

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
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

function toCamelCase(snakeStr: string): string {
  return snakeStr.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Function to transform JSON object keys to camelCase
// deno-lint-ignore no-explicit-any
export const transformKeysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeysToCamelCase(item));
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelCaseKey = toCamelCase(key);
      acc[camelCaseKey] = transformKeysToCamelCase(obj[key]);
      return acc;
      // deno-lint-ignore no-explicit-any
    }, {} as any);
  }
  return obj; // If it's not an object or array, return the value as-is
};

// deno-lint-ignore no-explicit-any
export const isIterable = (obj: any): boolean => {
  return obj != null && typeof obj[Symbol.iterator] === "function";
};

export const formatMoney = (amount: number): string => {
  // Format to 2 decimal places with a £ sign and commas for thousands
  return `£${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const createDateFromMonth = (month: string, year: string) => {
  const date = new Date();
  date.setFullYear(parseInt(year));
  date.setMonth(parseInt(month) - 1);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getStartAndEndDates = (month: number, year: number) => {
  const startDate = createDateFromMonth(month.toString(), year.toString());
  let endMonth = month + 1;
  let endYear = year;
  if (endMonth === 13) {
    endMonth = 1;
    endYear++;
  }
  const endDate = createDateFromMonth(endMonth.toString(), endYear.toString());
  return { startDate, endDate };
};
