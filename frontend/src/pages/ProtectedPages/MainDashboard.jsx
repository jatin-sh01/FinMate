import React, { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "../../components/Chart";
import { useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";

import { Income, Expense, Balance } from "../../utils/Icons";
import { useGetAllIncomesQuery } from "../../features/api/apiSlices/incomeApiSlice";
import { useGetAllExpensesQuery } from "../../features/api/apiSlices/expenseApiSlice";
import { getCurrencySymbol } from "../../utils/currencyFormatter";
import {
  DashboardCardSkeleton,
  TransactionSkeleton,
} from "../../components/Skeletons";

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const currencySymbol = getCurrencySymbol(user?.currency);
  const {
    data: incomeData,
    isLoading: incomeLoading,
    isFetching: incomeFetching,
    error: incomeError,
  } = useGetAllIncomesQuery();
  const {
    data: expenseData,
    isLoading: expenseLoading,
    isFetching: expenseFetching,
    error: expenseError,
  } = useGetAllExpensesQuery();

  const isLoading =
    incomeLoading || expenseLoading || incomeFetching || expenseFetching;

  const totalIncome = incomeData?.totalIncome || 0;
  const totalExpense = expenseData?.totalExpense || 0;
  const totalBalance = totalIncome - totalExpense;

  const recentHistory = useMemo(() => {
    const transactions = [
      ...(incomeData?.incomes || []).map((transaction) => ({
        ...transaction,
        type: "income",
      })),
      ...(expenseData?.expenses || []).map((transaction) => ({
        ...transaction,
        type: "expense",
      })),
    ];

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return transactions.slice(0, 5);
  }, [incomeData?.incomes, expenseData?.expenses]);

  const chartData = useMemo(() => {
    const incomes = incomeData?.incomes || [];
    const expenses = expenseData?.expenses || [];

    if (!incomes.length && !expenses.length) {
      return [];
    }

    const groupedByDate = new Map();

    incomes.forEach((item) => {
      const key = moment(item.date).format("MM/DD/YYYY");
      const existing = groupedByDate.get(key) || { income: 0, expense: 0 };
      groupedByDate.set(key, {
        income: existing.income + Number(item.amount || 0),
        expense: existing.expense,
      });
    });

    expenses.forEach((item) => {
      const key = moment(item.date).format("MM/DD/YYYY");
      const existing = groupedByDate.get(key) || { income: 0, expense: 0 };
      groupedByDate.set(key, {
        income: existing.income,
        expense: existing.expense + Number(item.amount || 0),
      });
    });

    return Array.from(groupedByDate.entries())
      .map(([name, values]) => ({ name, ...values }))
      .sort(
        (a, b) => moment(a.name, "MM/DD/YYYY") - moment(b.name, "MM/DD/YYYY"),
      );
  }, [incomeData?.incomes, expenseData?.expenses]);

  useEffect(() => {
    if (incomeError || expenseError) {
      toast.error("Failed to load dashboard data.");
    }
  }, [incomeError, expenseError]);

  return (
    <section className="dashboard-shell w-full px-3 md:px-6 transition-colors">
      <div className="max-w-7xl mx-auto py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <p className="text-indigo-600 dark:text-indigo-300 text-sm font-semibold tracking-wide uppercase">
            Financial Command Center
          </p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mt-2 text-center sm:text-left">
            Hello, {user?.username}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 ml-2">
              ⚡
            </span>
          </h2>
          <h3 className="section-subtitle text-sm md:text-base lg:text-lg text-center sm:text-left mt-2 max-w-3xl">
            Track your net worth trajectory, monitor spending trends, and run
            your personal finances like a modern startup.
          </h3>
        </motion.div>

        {isLoading ? (
          <DashboardCardSkeleton />
        ) : (
          <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                label: "Total Balance",
                value: totalBalance,
                Icon: Balance,
                tone:
                  totalBalance >= 0
                    ? "from-indigo-600 to-violet-600"
                    : "from-rose-600 to-pink-600",
              },
              {
                label: "Total Income",
                value: totalIncome,
                Icon: Income,
                tone: "from-cyan-500 to-indigo-600",
              },
              {
                label: "Total Expense",
                value: totalExpense,
                Icon: Expense,
                tone: "from-fuchsia-600 to-indigo-700",
              },
            ].map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className={`gradient-card ${card.tone} text-white p-6 md:p-7`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-indigo-100 text-sm font-medium mb-2">
                      {card.label}
                    </h4>
                    <h4 className="text-3xl font-bold leading-tight">
                      {currencySymbol}
                      <NumericFormat
                        className="ml-1"
                        value={card.value}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </h4>
                  </div>
                  <div className="pill-stat w-12 h-12 flex items-center justify-center">
                    <card.Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="w-full mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div style={{ height: "420px" }}>
              <Chart data={chartData} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="surface-card p-6 h-full">
              <h5 className="text-2xl font-semibold section-title mb-6">
                Recent Transactions
              </h5>
              <div className="space-y-3 max-h-[330px] overflow-y-auto pr-1">
                {isLoading ? (
                  <TransactionSkeleton />
                ) : recentHistory.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="section-subtitle">
                      No recent transactions to display.
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                      Add a transaction to activate your activity stream.
                    </p>
                  </div>
                ) : (
                  recentHistory.map((transaction, index) => (
                    <motion.div
                      key={transaction._id || `${transaction.type}-${index}`}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ y: -2 }}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center ${
                            transaction.type === "income"
                              ? "bg-gradient-to-r from-cyan-500 to-indigo-600"
                              : "bg-gradient-to-r from-fuchsia-500 to-indigo-600"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <Income className="w-5 h-5 text-white" />
                          ) : (
                            <Expense className="w-5 h-5 text-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h6 className="font-semibold text-slate-900 dark:text-slate-100 capitalize truncate">
                            {transaction.title}
                          </h6>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            {transaction.category}
                          </p>
                        </div>

                        <div className="text-right">
                          <p
                            className={`text-base md:text-lg font-bold ${
                              transaction.type === "income"
                                ? "text-cyan-600 dark:text-cyan-400"
                                : "text-fuchsia-600 dark:text-fuchsia-400"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {currencySymbol}
                            {transaction.amount}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {moment(transaction.date).format("MMM DD")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
