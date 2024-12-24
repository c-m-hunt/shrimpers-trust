import { SummaryData } from "@/src/types/finance";
import { areNumbersEqual, formatMoney } from "@/src/utils";

type Props = { summary: SummaryData };

const SummaryTable = ({ summary }: Props) => {
  const validationSummary = validateSummary(summary);

  return (
    <>
      {validationSummary.invalidMsgs.length > 0 && (
        <ValidationSummary
          msgs={validationSummary.invalidMsgs}
          successOrError="error"
        />
      )}
      {validationSummary.validMsgs.length > 0 && (
        <ValidationSummary
          msgs={validationSummary.validMsgs}
          successOrError="success"
        />
      )}
    </>
  );
};

type ValidationSummary = {
  isValid: boolean;
  validMsgs: string[];
  invalidMsgs: string[];
};

type ValidationSummaryProps = {
  msgs: string[];
  successOrError: "success" | "error";
};

const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  msgs,
  successOrError,
}) => {
  const color = successOrError === "success" ? "green" : "red";
  const borderColor = successOrError === "success" ? "teal" : "pink";
  return (
    <div
      className={`bg-${color}-50 p-2 rounded-md border-2 border-${borderColor}-500`}
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
      validateSummary.invalidMsgs.push(
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
