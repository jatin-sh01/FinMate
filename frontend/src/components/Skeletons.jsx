import React from "react";

const TransactionSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 animate-pulse"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
            <div className="text-right">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ChartSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto mb-6 animate-pulse"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  );
};

const DashboardCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 shadow-lg animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            </div>
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { TransactionSkeleton, ChartSkeleton, DashboardCardSkeleton };
