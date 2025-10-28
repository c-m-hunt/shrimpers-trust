export const formatMoney = (amount: number) => {
  return amount.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
};

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-GB");
};

export const areNumbersEqual = (
  num1: number,
  num2: number,
  epsilon: number = 0.001,
): boolean => {
  return Math.abs(num1 - num2) < epsilon;
};

export const annoyingDefaultProps = {
  placeholder: undefined,
  onResize: () => {},
  onResizeCapture: () => {},
  onPointerEnterCapture: () => {},
  onPointerLeaveCapture: () => {},
};
