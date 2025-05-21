import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DataPoint, TimeframeOption } from "../../types";
import { useState } from "react";

type PowerConsumptionChartProps = {
  dataPoints: DataPoint[];
};

export default function PowerConsumptionChart({
  dataPoints,
}: PowerConsumptionChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("day");

  if (!dataPoints.length) {
    return (
      <div className="flex justify-center items-center h-64 rounded">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const formatTime = (timestamp: Date) => {
    if (timeframe === "day") {
      return timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (timeframe === "week") {
      return `${timestamp.toLocaleDateString([], {
        weekday: "short",
      })} ${timestamp.toLocaleTimeString([], { hour: "2-digit" })}`;
    } else if (timeframe === "month") {
      return timestamp.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
      });
    } else {
      return timestamp.toLocaleDateString([], {
        month: "short",
        year: "2-digit",
      });
    }
  };

  // format data timestamps for chart
  const chartData = dataPoints.map((point) => ({
    ...point,
    time: formatTime(point.timestamp),
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={493}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis
            yAxisId="left"
            label={{ value: "Power (kW)", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Active Chargepoints",
              angle: 90,
              position: "insideRight",
            }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Power Consumption")
                return [`${(value as number).toFixed(2)} kW`, name];
              return [value, name];
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="plainline"
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
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="powerConsumption"
            stroke="#4a5685"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
            name="Power Consumption"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="numActiveChargePoints"
            stroke="#ef5446"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
            name="Active Chargepoints"
          />
        </LineChart>
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
