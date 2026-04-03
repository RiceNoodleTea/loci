"use client";

import { Brain } from "lucide-react";

const weeklyData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 1.8 },
  { day: "Thu", hours: 4.0 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 3.5 },
  { day: "Sun", hours: 2.2 },
];

const maxHours = Math.max(...weeklyData.map((d) => d.hours));

export default function FocusPulse() {
  return (
    <div className="card space-y-6">
      <div className="flex items-center gap-2">
        <Brain size={20} className="text-olive" />
        <h3 className="font-serif font-bold text-charcoal text-lg">
          Focus Pulse
        </h3>
      </div>

      {/* Weekly bar chart */}
      <div className="flex items-end justify-between gap-2 h-32">
        {weeklyData.map((d) => {
          const pct = (d.hours / maxHours) * 100;
          return (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div className="w-full flex flex-col justify-end h-24">
                <div
                  className="w-full bg-olive rounded-t-md transition-all duration-500"
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-muted uppercase">
                {d.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="label-caps mb-1">Avg. Focus Time</p>
          <p className="text-2xl font-serif font-bold text-charcoal">2h 45m</p>
        </div>
        <div>
          <p className="label-caps mb-1">Accuracy Rate</p>
          <p className="text-2xl font-serif font-bold text-charcoal">88.4%</p>
        </div>
      </div>

      {/* Insight */}
      <div className="bg-parchment-dark rounded-xl p-4">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-olive mt-1.5 shrink-0" />
          <p className="text-sm text-muted">
            Your focus peaks on Thursdays. Try scheduling challenging topics
            earlier in the week for more balanced study sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
