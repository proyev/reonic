import type { DataPoint, SimulationParams } from "../types";
import PowerConsumptionChart from "./charts/PowerConsumptionChart";
import SimulationControls from "./simulation/SimulationControls";
import SimulationSummary from "./simulation/SimulationSummary";
import Card from "./ui/Card";

import ChargingEventsChart from "./charts/ChargingEventsChart";

export default function Dashboard() {
  const generateSampleData = (): DataPoint[] => {
    const data: DataPoint[] = [];
    const now = new Date();

    // Generate 24 hours of data points at 15-minute intervals
    for (let i = 0; i < 24 * 4; i++) {
      const timestamp = new Date(now);
      timestamp.setHours(0, 0, 0, 0); // Start at midnight
      timestamp.setMinutes(timestamp.getMinutes() + i * 15); // Add 15 minutes per interval

      // Generate random power consumption with a daily pattern
      // Morning and evening peaks
      const hourOfDay = timestamp.getHours();
      let basePower = 0;

      if (hourOfDay >= 7 && hourOfDay <= 10) {
        // Morning peak
        basePower = 30 + Math.random() * 20;
      } else if (hourOfDay >= 16 && hourOfDay <= 20) {
        // Evening peak
        basePower = 40 + Math.random() * 30;
      } else if (hourOfDay >= 23 || hourOfDay <= 5) {
        // Night (low usage)
        basePower = 5 + Math.random() * 10;
      } else {
        // Regular daytime
        basePower = 15 + Math.random() * 15;
      }

      // Calculate active chargepoints based on power
      const numActiveChargePoints = Math.round(basePower / 11);

      data.push({
        timestamp,
        powerConsumption: basePower,
        numActiveChargePoints,
      });
    }

    return data;
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:justify-between">
          <div className="flex flex-col gap-6 lg:w-1/4 w-full">
            <Card className="h-fit min-w-max" title="Simulation Parameters">
              <SimulationControls
                onSimulationLaunch={(params: SimulationParams) => {
                  console.log(params);
                }}
              />
            </Card>

            <Card title="Simulation Summary">
              <SimulationSummary
                result={{
                  totalEnergyConsumed: 52438.72,
                  actualMaxPowerDemand: 112.46,
                  theoreticalMaxPowerDemand: 220, // 20 chargepoints × 11 kW
                  concurrencyFactor: 51.12, // (actualMax / theoreticalMax) × 100
                  dataPoints: [],
                }}
              />
            </Card>
          </div>

          <div className="flex flex-col justify-center gap-6 lg:w-3/4 w-full">
            <Card title="Power Consumption Analysis">
              <PowerConsumptionChart dataPoints={generateSampleData()} />
            </Card>

            <Card title="Charging Events Analysis">
              <ChargingEventsChart dataPoints={generateSampleData()} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
