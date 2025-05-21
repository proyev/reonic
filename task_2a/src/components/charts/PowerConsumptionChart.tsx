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
import type { DataPoint } from "../../types";

type PowerConsumptionChartProps = {
  dataPoints: DataPoint[];
};

export default function PowerConsumptionChart({
  dataPoints,
}: PowerConsumptionChartProps) {
  if (!dataPoints.length) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // format time for readability
  const chartData = dataPoints.map((point) => ({
    ...point,
    time: point.timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
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
  );
}
