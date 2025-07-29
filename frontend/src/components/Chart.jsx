import React from "react";
import { useSelector } from "react-redux";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getCurrencySymbol } from "../utils/currencyFormatter";

const Chart = ({ data }) => {
  const { theme } = useSelector((state) => state.theme);
  const user = useSelector((state) => state.auth.user);
  const currencySymbol = getCurrencySymbol(user?.currency);

  // Debug log to check if data is being passed
  console.log("Chart data:", data);

  // Check if data is empty or invalid
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center">
          Financial Overview
        </h3>
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No data available for chart
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 text-center">
            Add some transactions to see your financial overview
          </p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white font-medium">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{ color: entry.color }}
              className="font-semibold"
            >
              {`${
                entry.dataKey === "income" ? "Income" : "Expense"
              }: ${currencySymbol}${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center">
        Financial Overview
      </h3>
      <div className="w-full" style={{ height: "calc(100% - 60px)" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
              opacity={0.7}
            />
            <XAxis
              dataKey="name"
              stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
              fontSize={12}
            />
            <YAxis
              stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: "#ef4444", strokeWidth: 2 }}
              name="Expense"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
