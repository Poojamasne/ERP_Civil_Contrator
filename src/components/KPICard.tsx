import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
  onClick?: () => void;
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

export function KPICard({
  title,
  value,
  unit,
  change,
  icon,
  color = 'blue',
  onClick,
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={`kpi-card cursor-pointer border-2 ${colorMap[color]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium opacity-75 truncate">{title}</p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">
            {value}
            {unit && <span className="text-xs sm:text-base lg:text-lg ml-1">{unit}</span>}
          </h3>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-1 sm:mt-2 text-xs sm:text-sm">
              {change >= 0 ? (
                <>
                  <TrendingUp size={14} className="sm:size-4" />
                  <span>{change}% from last month</span>
                </>
              ) : (
                <>
                  <TrendingDown size={14} className="sm:size-4" />
                  <span>{Math.abs(change)}% from last month</span>
                </>
              )}
            </div>
          )}
        </div>
        {icon && <div className="text-lg sm:text-2xl lg:text-3xl opacity-50 flex-shrink-0">{icon}</div>}
      </div>
    </div>
  );
}
