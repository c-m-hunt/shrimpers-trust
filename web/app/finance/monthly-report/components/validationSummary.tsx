import { SummaryData } from "@/src/types/finance";
import {
  annoyingDefaultProps,
  areNumbersEqual,
  formatMoney,
} from "@/src/utils";
import { Typography } from "@material-tailwind/react";

type Props = { summary: SummaryData };

const SummaryTable = ({ summary }: Props) => {
  const validationSummary = validateSummary(summary);

  return (
    <div className="mb-8">
      <Typography variant="h6" className="mt-8" {...annoyingDefaultProps}>
        Validation Summary
      </Typography>
      {validationSummary.invalidMsgs.length > 0 && (
        <ValidationSummary
          msgs={validationSummary.invalidMsgs}
          summaryType="error"
        />
      )}
      {validationSummary.warningMsgs.length > 0 && (
        <ValidationSummary
          msgs={validationSummary.warningMsgs}
          summaryType="warning"
        />
      )}
      {validationSummary.validMsgs.length > 0 && (
        <ValidationSummary
          msgs={validationSummary.validMsgs}
          summaryType="success"
        />
      )}
    </div>
  );
};

type ValidationSummary = {
  isValid: boolean;
  validMsgs: string[];
  invalidMsgs: string[];
  warningMsgs: string[];
};

type ValidationSummaryProps = {
  msgs: string[];
  summaryType: "success" | "error" | "warning";
};

const messageTypeToColor = (type: string): string => {
  switch (type) {
    case "success":
      return "green";
    case "error":
      return "red";
    case "warning":
      return "orange";
    default:
      return "black";
  }
};

const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  msgs,
  summaryType,
}) => {
  const color = messageTypeToColor(summaryType);
  const borderColor = messageTypeToColor(summaryType);
  return (
    <div
      className={`bg-${color}-50 p-2 mb-1 rounded-md border-2 border-${borderColor}-500`}
    >
      <ul>
        {msgs.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

const validateSummary = (summary: SummaryData): ValidationSummary => {
  const validateSummary: ValidationSummary = {
    isValid: true,
    validMsgs: [],
    invalidMsgs: [],
    warningMsgs: [],
  };

  if (
    !areNumbersEqual(
      summary.transTotal,
      summary.itemsValue +
        summary.refundsTotal +
        summary.spendingTotal +
        summary.cardTotal +
        summary.chargebackTotal,
    )
  ) {
    validateSummary.isValid = false;
    validateSummary.invalidMsgs.push(
      "Total doesn't match items value plus refunds and card purchases",
    );
  } else {
    validateSummary.validMsgs.push(
      "Total matches items value plus refunds and card purchases",
    );
  }

  const balanceDiff = summary.balance.endBalance - summary.balance.startBalance;

  const grandTotal =
    summary.transTotal + summary.feesTotal + summary.withdrawalTotal;

  if (!areNumbersEqual(balanceDiff, grandTotal)) {
    if (areNumbersEqual(balanceDiff, grandTotal + summary.pendingValue)) {
      validateSummary.isValid = false;
      validateSummary.warningMsgs.push(
        "Balance difference matches transactions plus fees plus pending",
      );
    } else {
      const diff = balanceDiff - (grandTotal + summary.pendingValue);
      validateSummary.isValid = false;
      validateSummary.invalidMsgs.push(
        "Balance difference doesn't match transactions plus fees: " +
          formatMoney(diff),
      );
    }
  } else {
    validateSummary.validMsgs.push(
      "Balance difference matches transactions plus fees",
    );
  }

  return validateSummary;
};
export default SummaryTable;
