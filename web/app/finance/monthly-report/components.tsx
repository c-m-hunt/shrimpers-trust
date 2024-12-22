import { CardSummary, SummaryData } from "@/src/types/finance";

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
          <td>{summary.balance.startBalance}</td>
          <td>{summary.balance.endBalance}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default BalanceTable;
