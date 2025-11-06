import React from 'react';
import { Badge } from './badge';
import { Card, CardContent } from './card';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export const StatisticsCard = ({ cards }) => {
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 bg-black overflow-hidden rounded-xl border border-gray-600">
        {cards.map((card, i) => (
          <Card
            key={i}
            className="border-0 shadow-none rounded-none border-y lg:border-x lg:border-y-0 border-gray-600 last:border-0 first:border-0 bg-black"
          >
            <CardContent className="flex flex-col h-full space-y-6 justify-between">
              {/* Title & Subtitle */}
              <div className="space-y-0.5">
                <div className="text-lg font-semibold text-white">{card.title}</div>
                <div className="text-sm text-gray-400">{card.subtitle}</div>
              </div>

              {/* Information */}
              <div className="flex-1 flex flex-col gap-1.5 justify-between grow">
                {/* Value & Delta */}
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold tracking-tight text-white">{card.value}</span>
                  <Badge
                    className={cn(
                      card.badge.color,
                      "px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-none"
                    )}
                  >
                    <card.badge.icon className={cn("w-3 h-3", card.badge.iconColor)} />
                    {card.badge.text}
                  </Badge>
                </div>
                {/* Subtext */}
                <div className="text-sm">{card.subtext}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};