import logger from "./logger.ts";

export { logger };

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
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  date.setMonth(parseInt(month) - 1);
  return date;
};

type StartAndEndDate = {
  startDate: Date;
  endDate: Date;
};

/**
 * Gets the start and end date of the report. Start date will be the first day of the month provided.
 * End date will be the first day of the next month. If the next month is in the future, it will be today.
 * @param month Month
 * @param year Year
 * @returns Object returning start and end dates
 */
export const getStartAndEndDates = (
  month: number,
  year: number,
): StartAndEndDate => {
  const startDate = createDateFromMonth(month.toString(), year.toString());
  let endMonth = month + 1;
  let endYear = year;
  if (endMonth === 13) {
    endMonth = 1;
    endYear++;
  }
  let endDate = createDateFromMonth(endMonth.toString(), endYear.toString());
  // If end date is greater than today, set it to today
  if (endDate > new Date()) {
    endDate = new Date();
    endDate.setHours(0, 0, 0, 0);
  }
  return { startDate, endDate };
};

export const areNumbersEqual = (
  num1: number,
  num2: number,
  epsilon: number = 0.001,
): boolean => {
  return Math.abs(num1 - num2) < epsilon;
};
