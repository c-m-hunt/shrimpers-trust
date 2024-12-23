import { SummaryData } from "@/src/types/finance";
import { formatDate, formatMoney } from "@/src/utils";

type Props = { summary: SummaryData };

const SummaryTable = ({ summary }: Props) => {
  return (
    <table className="w-full mt-8 table-auto">
      <tbody>
        <tr>
          <td>Total</td>
          <td className="text-right">{formatMoney(summary.transTotal)}</td>
        </tr>
        <tr>
          <td>Fees</td>
          <td className="text-right">{formatMoney(summary.feesTotal)}</td>
        </tr>
        <tr>
          <td>Withdrawals</td>
          <td className="text-right">{formatMoney(summary.withdrawalTotal)}</td>
        </tr>
        <tr>
          <td>Total plus fees plus withdrawals</td>
          <td className="text-right">
            {formatMoney(
              summary.transTotal + summary.feesTotal + summary.withdrawalTotal,
            )}
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Transaction count</td>
          <td className="text-right">{summary.transactionCount}</td>
        </tr>
        <tr>
          <td>Items value</td>
          <td className="text-right">{formatMoney(summary.itemsValue)}</td>
        </tr>
        <tr>
          <td>Items value minus refunds</td>
          <td className="text-right">
            {formatMoney(summary.itemsValue + summary.refundsTotal)}
          </td>
        </tr>
        <tr>
          <td>Items value minus refunds and fees</td>
          <td className="text-right">
            {formatMoney(
              summary.itemsValue + summary.refundsTotal + summary.feesTotal,
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default SummaryTable;
