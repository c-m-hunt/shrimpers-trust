export const formatMoney = (amount: number) => {
  return amount.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
};

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-GB");
};

export const annoyingDefaultProps = {
  placeholder: undefined,
  onPointerEnterCapture: undefined,
  onPointerLeaveCapture: undefined,
};
