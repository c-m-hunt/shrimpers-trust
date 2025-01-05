import { SummaryData } from "@/src/types/finance";
import { formatDate, formatMoney } from "@/src/utils";

type Props = { summary: SummaryData };

const BalanceTable = ({ summary }: Props) => {
  return (
    <table className="w-full table-auto mt-2">
      <thead>
        <tr>
          <th></th>
          <th className="text-right">Start Balance</th>
          <th className="text-right">End Balance</th>
          <th className="text-right">Difference</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th className="text-left">Dates</th>
          <td className="text-right">{formatDate(summary.dateRange.start)}</td>
          <td className="text-right">{formatDate(summary.dateRange.end)}</td>
        </tr>
        <tr>
          <th className="text-left">Balance</th>
          <td className="text-right">
            {formatMoney(summary.balance.startBalance)}
          </td>
          <td className="text-right">
            {formatMoney(summary.balance.endBalance)}
          </td>
          <td className="font-bold text-right text-green-800">
            {formatMoney(
              summary.balance.endBalance - summary.balance.startBalance,
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default BalanceTable;
