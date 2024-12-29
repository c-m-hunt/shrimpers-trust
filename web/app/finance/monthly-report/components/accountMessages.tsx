import { AccountMessage, SummaryData } from "@/src/types/finance";
import {
  annoyingDefaultProps,
} from "@/src/utils";
import { Typography } from "@material-tailwind/react";

type Props = { summary: SummaryData };

const AccountMessages = ({ summary }: Props) => {
  const { messages: msgs } = summary;
  return (
    <>
      <Typography variant="h6" className="mt-8" {...annoyingDefaultProps}>
        Account Messages
      </Typography>
      <div>
        <div className={`p-2 rounded-md border-2 border-black-500 bg-gray-100`}>
          <ul>
            {msgs.map((msg: AccountMessage) => (
              <li
                className={`text-${msg.type === "warn" ? "orange" : "red"}-500`}
                key={msg.transactionId}
              >
                {msg.transactionId} - {msg.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default AccountMessages;
