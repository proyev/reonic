import { useState } from "react";
import type { SimulationParams } from "../../types";

type SimulationControlsProps = {
  params: SimulationParams;
  onSimulationLaunch: (params: SimulationParams) => void;
};

export default function SimulationControls({
  params,
  onSimulationLaunch,
}: SimulationControlsProps) {
  const [simParams, setSimParams] = useState<SimulationParams>(params);

  const handleParamChange = (key: keyof SimulationParams, value: number) => {
    setSimParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSimulationLaunch = () => {
    onSimulationLaunch(simParams);
  };

  // TODO - possibly wrap everyhting into a form and add form validation
  // TODO - quickly check everything in here
  return (
    <div className="bg-white rounded-2xl">
      <div className="bg-primary p-4">
        <h2 className="text-lg font-semibold text-white">
          Simulation Parameters
        </h2>
      </div>

      <div className="p-6 space-y-6">
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
            <span>
              {/* {params.arrivalProbabilityMultiplier}% */}
              {simParams.arrivalProbabilityMultiplier}%
            </span>
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
              min="10"
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
              min="3"
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
          onClick={handleSimulationLaunch}
          className="w-full mt-4 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center duration-300 bg-primary hover:bg-primary/70 hover:cursor-pointer"
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
      </div>
    </div>
  );
}
