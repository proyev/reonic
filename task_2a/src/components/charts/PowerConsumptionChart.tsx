import { useState, useMemo } from "react";
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

type PowerConsumptionChartProps = {
  dataPoints: DataPoint[];
};

export default function PowerConsumptionChart({
  dataPoints,
}: PowerConsumptionChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("day");

  // process data based on selected timeframe
  const processedData = useMemo(() => {
    if (!dataPoints.length) return [];

    // day view: use actual data with 15-minute intervals
    if (timeframe === "day") {
      return dataPoints.map((point) => ({
        ...point,
        time: point.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
    }

    // week view: mock data for each day of the week (Mon-Sun)
    if (timeframe === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const maxPower = Math.max(...dataPoints.map((d) => d.powerConsumption));
      const maxChargepoints = Math.max(
        ...dataPoints.map((d) => d.numActiveChargePoints)
      );

      // create a weekly pattern with workday/weekend variation
      return days.map((day, index) => {
        const isWeekend = index >= 5; // Sat & Sun

        // scale factors to create a weekly pattern
        const weekdayFactor = isWeekend ? 0.7 : 1;
        const dayFactor = 0.7 + (index % 5) * 0.06; // slightly different each weekday

        const powerValue =
          maxPower * weekdayFactor * dayFactor * (0.8 + Math.random() * 0.4);
        const chargepointsValue =
          maxChargepoints *
          weekdayFactor *
          dayFactor *
          (0.8 + Math.random() * 0.4);

        return {
          time: day, // day of week as the X-axis label
          powerConsumption: powerValue,
          numActiveChargePoints: chargepointsValue,
        };
      });
    }

    // month view: data for each day of the month (1-30)
    if (timeframe === "month") {
      const maxPower = Math.max(...dataPoints.map((d) => d.powerConsumption));
      const maxChargepoints = Math.max(
        ...dataPoints.map((d) => d.numActiveChargePoints)
      );

      // gen 30 days of data with a realistic monthly pattern
      return Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const isWeekend = day % 7 === 0 || day % 7 === 6; // weekend detection
        const weekFactor = Math.floor(day / 7); // week of month (0-3)

        // monthly pattern with weekly cycles
        const dayFactor = isWeekend ? 0.7 : 0.85 + weekFactor * 0.05;

        // calc values with some randomness for realism
        const powerValue = maxPower * dayFactor * (0.85 + Math.random() * 0.3);
        const chargepointsValue =
          maxChargepoints * dayFactor * (0.85 + Math.random() * 0.3);

        return {
          time: `${day}`, // day of month as X-axis label
          powerConsumption: powerValue,
          numActiveChargePoints: chargepointsValue,
        };
      });
    }

    // year view: data for each month (Jan-Dec)
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
      const maxPower = Math.max(...dataPoints.map((d) => d.powerConsumption));
      const maxChargepoints = Math.max(
        ...dataPoints.map((d) => d.numActiveChargePoints)
      );

      // gen monthly data with seasonal patterns
      return months.map((month, i) => {
        // create a seasonal pattern
        const seasonalIndex = i < 6 ? i : 12 - i; // 0->5->0 pattern for seasonal effect
        const seasonFactor = 0.7 + seasonalIndex * 0.06;

        // values with seasonal patterns
        const powerValue =
          maxPower * seasonFactor * (0.85 + Math.random() * 0.3);
        const chargepointsValue =
          maxChargepoints * seasonFactor * (0.85 + Math.random() * 0.3);

        return {
          time: month, // month name as X-axis label
          powerConsumption: powerValue,
          numActiveChargePoints: chargepointsValue,
        };
      });
    }

    return [];
  }, [dataPoints, timeframe]);

  // Y-axis domains based on data
  const yDomains = useMemo(() => {
    if (!processedData.length)
      return { power: [0, 100], chargepoints: [0, 10] };

    const maxPower = Math.max(...processedData.map((d) => d.powerConsumption));
    const maxChargepoints = Math.max(
      ...processedData.map((d) => d.numActiveChargePoints)
    );

    // round up to nearest 50 for power
    const powerMax = Math.ceil(maxPower / 50) * 50;

    // round up to nearest integer for chargepoints
    const chargepointsMax = Math.ceil(maxChargepoints);

    return {
      power: [0, powerMax],
      chargepoints: [0, chargepointsMax],
    };
  }, [processedData]);

  return (
    <div>
      {dataPoints.length ? (
        <>
          <ResponsiveContainer width="100%" height={493}>
            <LineChart
              data={processedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                aria-label={`Time (${timeframe} view)`}
                angle={timeframe === "day" ? -45 : 0}
                textAnchor={timeframe === "day" ? "end" : "middle"}
                height={timeframe === "day" ? 60 : 30}
                interval={timeframe === "day" ? 3 : 0} // fewer labels for day view
              />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Power (kW)",
                  angle: -90,
                  position: "insideLeft",
                }}
                domain={yDomains.power}
                aria-label="Power consumption in kilowatts"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Active Chargepoints",
                  angle: 90,
                  position: "insideRight",
                }}
                domain={yDomains.chargepoints}
                aria-label="Number of active chargepoints"
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Power Consumption")
                    return [`${Number(value).toFixed(2)} kW`, name];
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
