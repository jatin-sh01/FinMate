import React from "react";

const TransactionSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 animate-pulse"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-slate-700 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
            <div className="text-right">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-1"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ChartSkeleton = () => {
  return (
    <div className="surface-card p-6">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mx-auto mb-6 animate-pulse"></div>
      <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
    </div>
  );
};

const DashboardCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="rounded-2xl p-6 bg-gradient-to-br from-indigo-500/30 to-violet-500/30 dark:from-indigo-500/20 dark:to-violet-500/20 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="h-4 bg-white/60 dark:bg-slate-700 rounded w-20 mb-2"></div>
              <div className="h-8 bg-white/60 dark:bg-slate-700 rounded w-24"></div>
            </div>
            <div className="w-12 h-12 bg-white/60 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { TransactionSkeleton, ChartSkeleton, DashboardCardSkeleton };
