"use client";
import React, { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import BalanceTable from "./components/balanceTable";
import { CardSummary, SummaryData } from "@/src/types/finance";
import { ResponseData } from "@/app/api/finance/report/[type]/[month]/[year]/route";
import { annoyingDefaultProps as defaultProps } from "@/src/utils";
import SummaryTable from "./components/summaryTable";
import ValidationSummary from "./components/validationSummary";
import TravelSummary from "./components/travelSummary";

type ReportData = {
  paypal: SummaryData;
  zettle: CardSummary;
};

const MonthlyReport = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [reportData, setReportData] = useState<null | ReportData>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleMonthChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setYear(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const paypalResponse = await fetch(
        `/api/finance/report/paypal/${month}/${year}`,
      );
      const paypalData: ResponseData = await paypalResponse.json();

      const zettleResponse = await fetch(
        `/api/finance/report/zettle/${month}/${year}`,
      );
      const zettleData: ResponseData = await zettleResponse.json();
      console.log(paypalData, zettleData);
      setReportData({
        paypal: paypalData.data as SummaryData,
        zettle: zettleData.data as CardSummary,
      });
    } catch (error) {
      setError("An error occurred while fetching the report data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card color="transparent" shadow={false} {...defaultProps}>
        <Typography variant="h4" color="blue-gray" {...defaultProps}>
          Monthly Report
        </Typography>
        <Typography color="gray" className="mt-1 font-normal" {...defaultProps}>
          Select the month and year to generate the report.
        </Typography>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex flex-col gap-6">
            <Input
              size="lg"
              label="Month"
              value={month}
              onChange={handleMonthChange}
              required
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
            <Input
              size="lg"
              label="Year"
              value={year}
              onChange={handleYearChange}
              required
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
          </div>
          <Button
            className="mt-6"
            fullWidth
            type="submit"
            disabled={loading}
            {...defaultProps}
          >
            {loading ? "Generating Report..." : "Create Report"}
          </Button>
          {error && (
            <Typography color="red" className="mt-4" {...defaultProps}>
              {error}
            </Typography>
          )}
        </form>
      </Card>
      {loading && (
        <Typography
          variant="h5"
          color="blue-gray"
          className="mt-8"
          {...defaultProps}
        >
          Loading...
        </Typography>
      )}
      {reportData && (
        <div className="mt-8">
          <Typography variant="h5" color="blue-gray" {...defaultProps}>
            Report Data
          </Typography>
          {reportData.paypal && (
            <>
              <BalanceTable summary={reportData.paypal} />
              <hr/>
              <SummaryTable summary={reportData.paypal} />
              <hr/>
              <ValidationSummary summary={reportData.paypal} />
              <hr/>
              <TravelSummary summary={reportData.paypal} />
            </>
          )}

          <pre className="mt-4 p-4 bg-gray-100 rounded-md">
            {JSON.stringify(reportData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default withPageAuthRequired(MonthlyReport);
