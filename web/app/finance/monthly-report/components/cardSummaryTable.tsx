import { CardSummary, SummaryData } from "@/src/types/finance";
import { annoyingDefaultProps, formatMoney } from "@/src/utils";
import { Typography } from "@material-tailwind/react";

type Props = { summary: CardSummary };

const CardSummaryTable = ({ summary }: Props) => {
  return (
    <>
      <Typography variant="h6" className="mt-8" {...annoyingDefaultProps}>
        Card Summary
      </Typography>
      <table className="w-full table-auto mt-2">
        <tbody>
          <tr>
            <td>Total transactions</td>
            <td className="text-right">{summary.totalTransactions}</td>
          </tr>
          <tr>
            <td>Total value</td>
            <td className="text-right">{formatMoney(summary.totalAmount)}</td>
          </tr>
          <tr>
            <td>Fees</td>
            <td className="text-right">{formatMoney(summary.totalFees)}</td>
          </tr>
          <tr>
            <td className="text-purple-700 font-bold">
              Net card purchases minus fees
            </td>
            <td className="text-right text-purple-700 font-bold">
              {formatMoney(summary.totalAmount + summary.totalFees)}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default CardSummaryTable;
