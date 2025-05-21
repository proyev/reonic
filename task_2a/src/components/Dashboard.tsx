import type { SimulationParams, SimulationResult } from "../types";
import PowerConsumptionChart from "./charts/PowerConsumptionChart";
import SimulationControls from "./simulation/SimulationControls";
import SimulationSummary from "./simulation/SimulationSummary";
import Card from "./ui/Card";

import ChargingEventsChart from "./charts/ChargingEventsChart";
import { useState, useTransition } from "react";
import { SimulationService } from "../adapters/simulation";
import Spinner from "./ui/Spinner";

export default function Dashboard() {
  const [simulationResult, setSimulationResult] = useState<SimulationResult>();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  const handleSimulationLaunch = async (params: SimulationParams) => {
    setError(undefined);

    startTransition(async () => {
      try {
        const result = await SimulationService.runSimulation(params);
        startTransition(() => setSimulationResult(result));
      } catch {
        setError("An error occurred while running the simulation.");
      }
    });
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:justify-between">
          <div className="flex flex-col gap-6 lg:w-1/4 w-full">
            <Card className="h-fit min-w-max" title="Simulation Parameters">
              <SimulationControls onSimulationLaunch={handleSimulationLaunch} />
            </Card>

            {!isPending && !error && simulationResult && (
              <Card title="Simulation Summary">
                <SimulationSummary result={{ ...simulationResult }} />
              </Card>
            )}
          </div>

          <div className="flex flex-col justify-center gap-6 lg:w-3/4 w-full">
            {error && (
              <Card className="bg-red-50 border border-red-200 w-1/2 mx-auto">
                <div className="flex items-center text-red-700 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="font-medium">Simulation Error</span>
                </div>
                <p className="text-red-600">{error}</p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setError(undefined)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </Card>
            )}

            {isPending ? (
              <div className="flex justify-center items-center">
                <Spinner size={40} />
              </div>
            ) : (
              <>
                {simulationResult && !error && (
                  <>
                    <Card title="Power Consumption Analysis">
                      <PowerConsumptionChart
                        dataPoints={simulationResult?.dataPoints ?? []}
                      />
                    </Card>

                    <Card title="Charging Events Analysis">
                      <ChargingEventsChart
                        dataPoints={simulationResult?.dataPoints ?? []}
                      />
                    </Card>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
