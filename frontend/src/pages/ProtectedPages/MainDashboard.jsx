import React, { useState, useEffect } from "react";
import Chart from "../../components/Chart";
import { useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";

import { Income, Expense, Balance } from "../../utils/Icons";
import { useGetAllIncomesQuery } from "../../features/api/apiSlices/incomeApiSlice";
import { useGetAllExpensesQuery } from "../../features/api/apiSlices/expenseApiSlice";
import {
  getCurrencySymbol,
  formatAmountForDisplay,
} from "../../utils/currencyFormatter";

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const currencySymbol = getCurrencySymbol(user?.currency);

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [recentHistory, setRecentHistory] = useState([]);

  const { data: incomeData, refetch: refetchIncomes } = useGetAllIncomesQuery();
  const { data: expenseData, refetch: refetchExpenses } =
    useGetAllExpensesQuery();

  const fetchData = async () => {
    try {
      await refetchIncomes();
      await refetchExpenses();
      if (incomeData) {
        setTotalIncome(incomeData?.totalIncome);
      }
      if (expenseData) {
        setTotalExpense(expenseData?.totalExpense);
      }
      const totalBalance =
        (incomeData?.totalIncome || 0) - (expenseData?.totalExpense || 0);
      setTotalBalance(totalBalance);

      const recentHistory = [
        ...(incomeData?.incomes || []).map((transaction) => ({
          ...transaction,
          type: "income",
        })),
        ...(expenseData?.expenses || []).map((transaction) => ({
          ...transaction,
          type: "expense",
        })),
      ];
      recentHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
      const recentTransactions = recentHistory.slice(0, 3);

      setRecentHistory(recentTransactions);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    }
  };

  const incomeDates =
    incomeData?.incomes.map((income) =>
      moment(income.date).format("MM/DD/YYYY")
    ) || [];
  const incomeAmounts =
    incomeData?.incomes.map((income) => income.amount) || [];
  const expenseAmounts =
    expenseData?.expenses.map((expense) => expense.amount) || [];

  let data = [];

  if (incomeAmounts.length === 0 || expenseAmounts.length === 0) {
    data = [
      {
        name: "Data unavailable. Please add your incomes/expenses to populate this display.",
        income: 0,
        expense: 0,
      },
    ];
  } else {
    data = incomeDates.map((date, index) => ({
      name: date,
      income: incomeAmounts[index] || 0,
      expense: expenseAmounts[index] || 0,
    }));
  }

  useEffect(() => {
    fetchData();
  }, [incomeData, expenseData]);

  return (
    <section className="w-full min-h-screen px-3 md:px-6 bg-gray-50 dark:bg-gray-900/50 transition-colors">
      <div className="max-w-7xl mx-auto py-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl mt-3 text-center sm:text-left text-pretty text-gray-800 dark:text-white">
          Hello, {user?.username}⚡
        </h2>
        <h3 className="font-outfit text-sm md:text-base lg:text-lg text-center sm:text-left text-pretty text-gray-600 dark:text-gray-300 mb-8">
          Welcome to your financial command center! Here's your complete
          financial overview. Track your income, monitor expenses, and make
          smarter financial decisions with{" "}
          <span className="font-bold text-primary">FinMate!</span>
        </h3>
        <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-white">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-blue-100 text-sm font-medium mb-2">
                  Total Balance
                </h4>
                <h4
                  className={`text-3xl font-bold ${
                    totalBalance < 0 ? "text-red-200" : "text-white"
                  }`}
                >
                  {currencySymbol}
                  <NumericFormat
                    className="ml-1"
                    value={totalBalance}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </h4>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Balance className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-white">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-emerald-100 text-sm font-medium mb-2">
                  Total Incomes
                </h4>
                <h4 className="text-3xl font-bold">
                  {currencySymbol}
                  <NumericFormat
                    className="ml-1"
                    value={totalIncome}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </h4>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Income className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-white">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-red-100 text-sm font-medium mb-2">
                  Total Expenses
                </h4>
                <h4 className="text-3xl font-bold">
                  {currencySymbol}
                  <NumericFormat
                    className="ml-1"
                    value={totalExpense}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </h4>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Expense className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-8 md:flex gap-x-6">
          <div className="w-full md:w-[60%] mb-8 md:mb-0">
            <div style={{ height: "400px" }}>
              <Chart data={data} />
            </div>
          </div>
          <div className="w-full md:w-[40%]">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full">
              <h5 className="text-2xl font-semibold text-center md:text-left text-gray-900 dark:text-white mb-6">
                Recent Transactions
              </h5>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {recentHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No recent transactions to display.
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Start by adding your first transaction!
                    </p>
                  </div>
                ) : (
                  recentHistory.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md hover:scale-[1.01] transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            transaction.type === "income"
                              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                              : "bg-gradient-to-r from-red-400 to-red-500"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <Income className="w-6 h-6 text-white" />
                          ) : (
                            <Expense className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h6 className="font-semibold text-gray-900 dark:text-white capitalize truncate">
                            {transaction.title}
                          </h6>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {transaction.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              transaction.type === "income"
                                ? "text-emerald-500"
                                : "text-red-500"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {currencySymbol}
                            {transaction.amount}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {moment(transaction.date).format("MMM DD")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
