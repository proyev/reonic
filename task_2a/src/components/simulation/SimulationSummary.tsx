import type { SimulationResult } from "../../types";

type SimulationSummaryProps = {
  result: SimulationResult;
};

export default function SimulationSummary({ result }: SimulationSummaryProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Simulation Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg">
          <h3 className="text-sm font-medium text-primary">
            Total Energy Consumed
          </h3>
          <p className="text-2xl font-bold">
            {result.totalEnergyConsumed.toFixed(2)} kWh
          </p>
        </div>

        <div className=" p-4 rounded-lg">
          <h3 className="text-sm font-medium text-accent">
            Theoretical Max Power
          </h3>
          <p className="text-2xl font-bold">
            {result.theoreticalMaxPowerDemand.toFixed(2)} kW
          </p>
        </div>

        <div className="p-4 rounded-lg">
          <h3 className="text-sm font-medium text-secondary">
            Actual Max Power
          </h3>
          <p className="text-2xl font-bold">
            {result.actualMaxPowerDemand.toFixed(2)} kW
          </p>
        </div>

        <div className="p-4 rounded-lg">
          <h3 className="text-sm font-medium text-accent-light">
            Concurrency Factor
          </h3>
          <p className="text-2xl font-bold">
            {result.concurencyFactor.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
