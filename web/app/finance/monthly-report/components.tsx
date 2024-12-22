import { SummaryData } from "@/src/types/finance";
import { formatDate, formatMoney } from "@/src/utils";

type Props = { summary: SummaryData };

const BalanceTable = ({ summary }: Props) => {
  return (
    <table className="w-full mt-8">
      <thead>
        <tr>
          <th className="text-left">Start Balance</th>
          <th className="text-left">End Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{formatDate(summary.dateRange.start)}</td>
          <td>{formatDate(summary.dateRange.end)}</td>
        </tr>
        <tr>
          <td>{formatMoney(summary.balance.startBalance)}</td>
          <td>{formatMoney(summary.balance.endBalance)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default BalanceTable;
