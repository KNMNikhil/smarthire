import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./card";

const cn = (...classes) => classes.filter(Boolean).join(' ');

export const StatsCard = ({
  title,
  value,
  icon,
  change,
  changeType,
  className,
}) => {
  const changeColor = changeType === 'positive'
    ? 'text-emerald-600'
    : 'text-red-600';

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
        <CardTitle className="text-sm font-medium text-gray-300">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className={cn("text-xs text-gray-400 mt-1", changeColor)}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
};