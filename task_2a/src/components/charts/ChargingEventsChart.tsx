import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DataPoint, TimeframeOption } from "../../types";

type ChargingEventsChartProps = {
  dataPoints: DataPoint[];
};

export default function ChargingEventsChart({
  dataPoints,
}: ChargingEventsChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("day");

  if (!dataPoints.length) {
    return (
      <div className="flex justify-center items-center h-64 rounded">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const getChargingEventsByPeriod = () => {
    const eventsByHour: Record<number, number> = {};

    // for day view: Count event starts by hour
    if (timeframe === "day") {
      for (let i = 0; i < 24; i++) {
        eventsByHour[i] = 0;
      }

      let lastPointActiveCount = 0;
      dataPoints.forEach((point) => {
        const hour = point.timestamp.getHours();

        if (lastPointActiveCount === 0 && point.numActiveChargePoints > 0) {
          eventsByHour[hour] += 1;
        }

        lastPointActiveCount = point.numActiveChargePoints;
      });

      return Object.entries(eventsByHour).map(([hour, count]) => {
        const hourNum = parseInt(hour);
        return {
          period: `${hourNum.toString().padStart(2, "0")}:00`,
          events: count,
        };
      });
    }

    // simplified implementaiton for weekly/monthly/yearly views - distribute events randomly for demonstration
    // in a real implementation - aggregate across the relevant time periods
    if (timeframe === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map((day) => ({
        period: day,
        events: Math.floor(Math.random() * 15) + 5, // rnd 5-20 events
      }));
    }

    if (timeframe === "month") {
      return Array.from({ length: 30 }, (_, i) => ({
        period: `Day ${i + 1}`,
        events: Math.floor(Math.random() * 10) + 2, // rnd 2-12 events
      }));
    }

    if (timeframe === "year") {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months.map((month) => ({
        period: month,
        events: Math.floor(Math.random() * 200) + 50, // rnd 50-250 events
      }));
    }

    return [];
  };

  const eventsData = getChargingEventsByPeriod();

  return (
    <div>
      <ResponsiveContainer width="100%" height={493}>
        <BarChart
          data={eventsData}
          margin={{ right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" angle={-45} textAnchor="end" height={60} />
          <YAxis
            label={{
              value: "Number of Events",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            formatter={(value) => [`${value} events`, "Charging Events"]}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="rect"
            iconSize={20}
            formatter={(value) => (
              <span
                style={{
                  color: "#4B5563",
                  marginLeft: "8px",
                  marginRight: "20px",
                  fontSize: "14px",
                }}
              >
                {value}
              </span>
            )}
          />
          <Bar dataKey="events" fill="#bcda8a" name="Charging Events" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center space-x-2">
        {(["day", "week", "month", "year"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setTimeframe(option)}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === option
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:cursor-pointer"
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
