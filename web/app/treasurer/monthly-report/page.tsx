"use client";
import React, { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button, Card, Input, Typography } from "@material-tailwind/react";

const MonthlyReport = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const paypalResponse = await fetch(
        `/api/treasurer/paypal/${month}/${year}`,
      );
      const paypalData = await paypalResponse.json();

      const zettleResponse = await fetch(
        `/api/treasurer/zettle/${month}/${year}`,
      );
      const zettleData = await zettleResponse.json();

      setReportData({ paypal: paypalData, zettle: zettleData });
    } catch (error) {
      setError("An error occurred while fetching the report data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Monthly Report
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
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
            />
            <Input
              size="lg"
              label="Year"
              value={year}
              onChange={handleYearChange}
              required
            />
          </div>
          <Button className="mt-6" fullWidth type="submit" disabled={loading}>
            {loading ? "Generating Report..." : "Create Report"}
          </Button>
          {error && (
            <Typography color="red" className="mt-4">{error}</Typography>
          )}
        </form>
      </Card>
      {reportData && (
        <div className="mt-8">
          <Typography variant="h5" color="blue-gray">
            Report Data
          </Typography>
          <pre className="mt-4 p-4 bg-gray-100 rounded-md">
            {JSON.stringify(reportData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default withPageAuthRequired(MonthlyReport);
