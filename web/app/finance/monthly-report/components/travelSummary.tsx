import { ItemSummary, SummaryData } from "@/src/types/finance";
import { annoyingDefaultProps, formatMoney } from "@/src/utils";
import { Typography } from "@material-tailwind/react";

type Props = { summary: SummaryData };

const TravelSummary = ({ summary }: Props) => {
  const { itemTotals: items } = summary;

  const travelItems = Object.keys(items).filter((item) =>
    item.startsWith(travelItemsStartWith),
  );

  const travelSummary: { [key: string]: ItemSummary } = {};

  for (const item of travelItems) {
    const newItem = getTravelSubcategory(item);
    if (newItem in travelSummary) {
      travelSummary[newItem]["total"] += items[item].total;
      travelSummary[newItem]["qty"] += items[item].qty;
    } else {
      travelSummary[newItem] = {
        total: items[item].total,
        qty: items[item].qty,
      };
    }
  }
  return (
    <>
      <Typography variant="h6" {...annoyingDefaultProps}>
        Travel Summary
      </Typography>
      <table className="w-full mt-8 table-auto mt-2">
        <tbody>
          {Object.keys(travelSummary).map((item) => (
            <tr key={item}>
              <td>{item}</td>
              <td className="text-right">
                {formatMoney(travelSummary[item].total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const travelItemsStartWith = "Travel Tickets for ";

export const getTravelSubcategory = (item: string): string => {
  return item
    .replace(travelItemsStartWith, "")
    .split(" - ")
    .splice(0, 2)
    .join(" - ");
};

export default TravelSummary;
