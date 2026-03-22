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

  // Check if data is empty or invalid
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full surface-card p-6 flex flex-col items-center justify-center">
        <h3 className="text-xl font-semibold mb-4 section-title text-center">
          Financial Overview
        </h3>
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-16 h-16 mb-4 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-400"
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
          <p className="section-subtitle text-center">
            No data available for chart
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 text-center">
            Add some transactions to see your financial overview
          </p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-indigo-100/70 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur-md">
          <p className="text-slate-900 dark:text-slate-100 font-semibold">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{ color: entry.color }}
              className="font-semibold text-sm"
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
    <div className="w-full h-full surface-card p-6">
      <h3 className="text-xl font-semibold mb-4 section-title text-center">
        Financial Overview
      </h3>
      <div className="w-full" style={{ height: "calc(100% - 60px)" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="incomeLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
              <linearGradient id="expenseLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F43F5E" />
                <stop offset="100%" stopColor="#FB7185" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "#334155" : "#CBD5E1"}
              opacity={0.45}
            />
            <XAxis
              dataKey="name"
              stroke={theme === "dark" ? "#94A3B8" : "#64748B"}
              fontSize={12}
            />
            <YAxis
              stroke={theme === "dark" ? "#94A3B8" : "#64748B"}
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
              stroke="url(#incomeLine)"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8, stroke: "#6366F1", strokeWidth: 2 }}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="url(#expenseLine)"
              strokeWidth={3}
              dot={{ fill: "#F43F5E", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8, stroke: "#F43F5E", strokeWidth: 2 }}
              name="Expense"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
