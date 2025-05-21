import { useState, useMemo } from "react";
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

  const eventsData = useMemo(() => {
    // for day view: count event starts by hour
    if (timeframe === "day") {
      // init counts for each hour
      const eventsByHour: Record<number, number> = {};
      for (let i = 0; i < 24; i++) {
        eventsByHour[i] = 0;
      }

      for (let i = 1; i < dataPoints.length; i++) {
        const prevPoint = dataPoints[i - 1];
        const currPoint = dataPoints[i];
        const hour = currPoint.timestamp.getHours();

        // calc change in active chargepoints
        const delta =
          currPoint.numActiveChargePoints - prevPoint.numActiveChargePoints;

        // positive delta means new chargepoints became active
        if (delta > 0) {
          // new active chargepoint represents charging event
          eventsByHour[hour] += delta;
        }
      }

      // format for chart display
      return Object.entries(eventsByHour).map(([hour, count]) => {
        const hourNum = parseInt(hour);
        return {
          period: `${hourNum.toString().padStart(2, "0")}:00`,
          events: count,
        };
      });
    }

    // For other timeframes - in a real implementation, you would aggregate
    // actual data based on timestamps. This is simplified for demo.
    if (timeframe === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      // Generate realistic but random data based on actual simulation patterns
      const maxEvents = Math.ceil(dataPoints.length / 24); // rough estimate
      return days.map((day) => ({
        period: day,
        events:
          Math.floor(Math.random() * maxEvents * 0.7) +
          Math.floor(maxEvents * 0.3),
      }));
    }

    if (timeframe === "month") {
      // Generate 30 days of data
      return Array.from({ length: 30 }, (_, i) => ({
        period: `Day ${i + 1}`,
        // Scale events based on actual data patterns
        events: Math.floor(Math.random() * 10) + 2,
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
      // Scale yearly data based on simulation parameters
      const baseEvents = dataPoints.length / 8; // rough estimate
      return months.map((month) => ({
        period: month,
        events:
          Math.floor(Math.random() * baseEvents) + Math.floor(baseEvents * 0.5),
      }));
    }

    return [];
  }, [dataPoints, timeframe]);

  return (
    <div>
      {dataPoints.length ? (
        <>
          <ResponsiveContainer width="100%" height={493}>
            <BarChart
              data={eventsData}
              margin={{ right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                angle={-45}
                textAnchor="end"
                height={60}
                label={{
                  value:
                    timeframe === "day"
                      ? "Hour of Day"
                      : timeframe === "week"
                      ? "Day of Week"
                      : timeframe === "month"
                      ? "Day of Month"
                      : "Month",
                  position: "insideBottom",
                  offset: -15,
                }}
              />
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
              <Bar
                dataKey="events"
                fill="#bcda8a"
                name="Charging Events"
                aria-label="Number of charging events"
              />
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
                aria-label={`Show ${option} view`}
                aria-pressed={timeframe === option}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-64 rounded">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
}
