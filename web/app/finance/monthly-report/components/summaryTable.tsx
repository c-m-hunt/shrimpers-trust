import { SummaryData } from "@/src/types/finance";
import { annoyingDefaultProps, formatMoney } from "@/src/utils";
import { Typography } from "@material-tailwind/react";

type Props = { summary: SummaryData };

const SummaryTable = ({ summary }: Props) => {
  return (
    <>
      <Typography variant="h6" className="mt-8" {...annoyingDefaultProps}>
        Summary
      </Typography>
      <table className="w-full table-auto mt-2">
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
            <td className="text-right">
              {formatMoney(summary.withdrawalTotal)}
            </td>
          </tr>
          <tr>
            <td className=" text-green-800 font-bold">
              Total plus fees plus withdrawals
            </td>
            <td className="text-right text-green-800 font-bold">
              {formatMoney(
                summary.transTotal +
                  summary.feesTotal +
                  summary.withdrawalTotal,
              )}
            </td>
          </tr>
          <DividerRow />
          <tr>
            <td>Refunds</td>
            <td className="text-right">{formatMoney(summary.refundsTotal)}</td>
          </tr>
          <tr>
            <td>Shipping</td>
            <td className="text-right">{formatMoney(summary.shippingTotal)}</td>
          </tr>
          <tr>
            <td className="text-purple-700 font-bold">Card purchases</td>
            <td className="text-right text-purple-700 font-bold">
              {formatMoney(summary.cardTotal)}
            </td>
          </tr>
          <tr>
            <td>Spending total</td>
            <td className="text-right">{formatMoney(summary.spendingTotal)}</td>
          </tr>
          <tr>
            <td>Pending</td>
            <td className="text-right">{formatMoney(summary.pendingValue)}</td>
          </tr>
          <DividerRow />
          <tr>
            <td>Transaction count</td>
            <td className="text-right">{summary.transactionCount}</td>
          </tr>
          <DividerRow />
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
    </>
  );
};

const DividerRow = () => (
  <tr className="border-t-2">
    <td className=""></td>
    <td></td>
  </tr>
);

export default SummaryTable;
