import { useEffect, useState, type FormEvent } from "react";
import type { SimulationParams } from "../../types";
import { z } from "zod";

type SimulationControlsProps = {
  onSimulationLaunch: (params: SimulationParams) => void;
};

const DEFAULT_SIM_PARAMS: SimulationParams = {
  numChargePoints: 20,
  chargePower: 11,
  evConsumption: 18,
  arrivalProbabilityMultiplier: 100,
};

const simulationParamsSchema = z.object({
  numChargePoints: z.number().int().min(1).max(30),
  arrivalProbabilityMultiplier: z.number().int().min(20).max(200),
  evConsumption: z.number().min(1).max(30),
  chargePower: z.number().min(1).max(50),
});

export default function SimulationControls({
  onSimulationLaunch,
}: SimulationControlsProps) {
  const [simParams, setSimParams] =
    useState<SimulationParams>(DEFAULT_SIM_PARAMS);
  const [areSimParamsValid, setSimParamsValid] = useState(true);

  const handleParamChange = (key: keyof SimulationParams, value: number) => {
    setSimParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSimulationLaunch = (e: FormEvent) => {
    e.preventDefault();

    const result = simulationParamsSchema.safeParse(simParams);
    if (result.success) onSimulationLaunch(result.data);
  };

  useEffect(() => {
    const result = simulationParamsSchema.safeParse(simParams);

    if (result.success) setSimParamsValid(true);
    else setSimParamsValid(false);
  }, [simParams]);

  return (
    <form onSubmit={handleSimulationLaunch} className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2 font-medium">
          <label>Chargepoints</label>
          <span>{simParams.numChargePoints}</span>
        </div>

        <input
          type="range"
          min="1"
          max="30"
          value={simParams.numChargePoints}
          onChange={(e) =>
            handleParamChange("numChargePoints", parseInt(e.target.value))
          }
          className="range-slider w-full h-2 bg-gray-200 rounded-full appearance-none"
        />

        <div className="flex justify-between items-center text-sm text-txt-secondary mt-1">
          <span>1</span>
          <span>30</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2 font-medium">
          <label>Arrival Probability</label>
          <span>{simParams.arrivalProbabilityMultiplier}%</span>
        </div>

        <input
          type="range"
          min="20"
          max="200"
          value={simParams.arrivalProbabilityMultiplier}
          onChange={(e) =>
            handleParamChange(
              "arrivalProbabilityMultiplier",
              parseInt(e.target.value)
            )
          }
          className="range-slider w-full h-2 bg-gray-200 rounded-full appearance-none"
        />

        <div className="flex justify-between items-center text-sm text-txt-secondary mt-1">
          <span>20%</span>
          <span>200%</span>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">
          EV Consumption (kWh/100km)
        </label>

        <div className="relative text-txt-secondary">
          <input
            type="number"
            min="1"
            max="30"
            value={simParams.evConsumption}
            onChange={(e) =>
              handleParamChange("evConsumption", parseFloat(e.target.value))
            }
            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span>kWh</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">Charging Power</label>

        <div className="relative text-txt-secondary">
          <input
            type="number"
            min="1"
            max="50"
            value={simParams.chargePower}
            onChange={(e) =>
              handleParamChange("chargePower", parseFloat(e.target.value))
            }
            className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary "
          />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span>kW</span>
          </div>
        </div>
      </div>

      <button
        disabled={!areSimParamsValid}
        type="submit"
        className="w-full mt-8 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center duration-300 bg-primary hover:bg-primary/70 hover:cursor-pointer disabled:bg-primary/30 disabled:cursor-not-allowed"
      >
        Run Simulation
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </form>
  );
}
