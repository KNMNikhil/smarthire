import React from 'react';
import { Badge } from './badge-2';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ArrowDown, ArrowUp } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const formatNumber = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return n.toLocaleString();
  return n.toString();
};

export const AdvancedStatsCard = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50">
          <CardHeader className="border-0 pb-2">
            <CardTitle className="text-gray-400 text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-medium text-white tracking-tight">
                {stat.format ? stat.format(stat.value) : stat.prefix + formatNumber(stat.value) + stat.suffix}
              </span>
              <Badge variant={stat.positive ? 'success' : 'destructive'} appearance="light" size="sm" className="rounded-full">
                {stat.delta > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(stat.delta)}%
              </Badge>
            </div>
            <div className="text-xs text-gray-400 mt-2 border-t border-gray-700 pt-2.5">
              Vs last month:{' '}
              <span className="font-medium text-white">
                {stat.lastFormat
                  ? stat.lastFormat(stat.lastMonth)
                  : stat.prefix + formatNumber(stat.lastMonth) + stat.suffix}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};