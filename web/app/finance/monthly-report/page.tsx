"use client";
import React, { useEffect, useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import {
  Button,
  Card,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import BalanceTable from "./components/balanceTable";
import { CardSummary, SummaryData } from "@/src/types/finance";
import { ResponseData } from "@/app/api/finance/report/[type]/[month]/[year]/route";
import { annoyingDefaultProps as defaultProps } from "@/src/utils";
import SummaryTable from "./components/summaryTable";
import ValidationSummary from "./components/validationSummary";
import TravelSummary from "./components/travelSummary";
import AccountMessages from "./components/accountMessages";
import CardSummaryTable from "./components/cardSummaryTable";

type ReportData = {
  paypal: SummaryData;
  zettle: CardSummary;
};

const MonthlyReport = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [disableCreateReportButton, setDisableCreateReportButton] =
    useState(false);
  const [reportData, setReportData] = useState<null | ReportData>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    validateForm();
  }, [month, year]);

  const handleMonthChange = (e: string | undefined) => {
    setMonth(e || "");
  };
  const handleYearChange = (e: string | undefined) => {
    setYear(e || "");
  };

  const validateForm = () => {
    if (month && year) {
      setDisableCreateReportButton(false);
    } else {
      setDisableCreateReportButton(true);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setReportData(null);
    setLoading(true);
    setError(null);

    try {
      setReportData(await getReportData(month, year));
    } catch (error) {
      setError(`An error occurred while fetching the report data. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const showYears = 3;
  const years = Array.from({ length: showYears }, (_, i) => currentYear - i);

  return (
    <div className="p-6">
      <Card color="transparent" shadow={false} {...defaultProps}>
        <Typography variant="h4" color="blue-gray" {...defaultProps}>
          Monthly Finance Report
        </Typography>
        <Typography color="gray" className="mt-1 font-normal" {...defaultProps}>
          Select the month and year to generate the report.
        </Typography>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex flex-col gap-6">
            <Select
              label="Select a month"
              {...defaultProps}
              value={month}
              onChange={(e) => handleMonthChange(e)}
            >
              <Option value="1">January</Option>
              <Option value="2">February</Option>
              <Option value="3">March</Option>
              <Option value="4">April</Option>
              <Option value="5">May</Option>
              <Option value="6">June</Option>
              <Option value="7">July</Option>
              <Option value="8">August</Option>
              <Option value="9">September</Option>
              <Option value="10">October</Option>
              <Option value="11">November</Option>
              <Option value="12">December</Option>
            </Select>
            <Select
              label="Select a year"
              {...defaultProps}
              value={year}
              onChange={(e) => handleYearChange(e)}
            >
              {years.map((year) => (
                <Option key={year} value={year.toString()}>
                  {year}
                </Option>
              ))}
            </Select>
          </div>
          <Button
            className="mt-6"
            fullWidth
            type="submit"
            disabled={loading === false && disableCreateReportButton}
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
              <SummaryTable summary={reportData.paypal} />
              <CardSummaryTable summary={reportData.zettle} />
              <AccountMessages summary={reportData.paypal} />
              <ValidationSummary summary={reportData.paypal} />
              <TravelSummary summary={reportData.paypal} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

const getReportData = async (month: string, year: string) => {
  const [paypalResponse, zettleResponse] = await Promise.all([
    fetch(`/api/finance/report/paypal/${month}/${year}`),
    fetch(`/api/finance/report/zettle/${month}/${year}`),
  ]);

  if (!paypalResponse.ok) {
    throw new Error("Failed to fetch PayPal data");
  }
  const paypalData: ResponseData = await paypalResponse.json();
  if (paypalData.error) {
    throw new Error(paypalData.error);
  }

  if (!zettleResponse.ok) {
    throw new Error("Failed to fetch Zettle data");
  }
  const zettleData: ResponseData = await zettleResponse.json();
  if (zettleData.error) {
    throw new Error(zettleData.error);
  }
  return {
    paypal: paypalData.data as SummaryData,
    zettle: zettleData.data as CardSummary,
  };
};

export default withPageAuthRequired(MonthlyReport);
