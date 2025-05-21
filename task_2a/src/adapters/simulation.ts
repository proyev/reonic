import type { DataPoint, SimulationParams, SimulationResult } from "../types";

// These arrival probabilities match Task 1 values (per hour 0-23)
const ARRIVAL_PROBABILITY_BY_HOUR = [
  0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 2.83, 2.83, 5.66, 5.66, 5.66,
  7.55, 7.55, 7.55, 10.38, 10.38, 10.38, 4.72, 4.72, 4.72, 0.94, 0.94,
];

// Charging demand probabilities (matching Task 1)
const CHARGING_DEMAND = [
  { probability: 34.31, demand: 0 },
  { probability: 4.9, demand: 5 },
  { probability: 9.8, demand: 10 },
  { probability: 11.76, demand: 20 },
  { probability: 8.82, demand: 30 },
  { probability: 11.76, demand: 50 },
  { probability: 10.78, demand: 100 },
  { probability: 4.9, demand: 200 },
  { probability: 2.94, demand: 300 },
];

/**
 * Service to integrate with Task 1 simulation logic
 */
export class SimulationService {
  /**
   * Run a simulation with the given parameters
   * @param params Simulation parameters from the UI
   * @returns Promise with simulation results
   */
  static async runSimulation(
    params: SimulationParams
  ): Promise<SimulationResult> {
    try {
      // INTEGRATION POINT: Replace this with actual Task 1 integration
      // -------------------------------------------------------------
      // import { Chargepoint, runSim } from "../task1";
      //
      // // Create chargepoints with UI parameters
      // const chargepoints = Array.from(
      //   { length: params.numChargePoints },
      //   () => new Chargepoint(undefined, params.chargePower)
      // );
      //
      // // Run the Task 1 simulation
      // const simResult = runSim(chargepoints);
      //
      // // Map Task 1 data to UI format
      // return {
      //   totalEnergyConsumed: simResult.totalEnergyConsumed,
      //   actualMaxPowerDemand: simResult.actualMaxPowerDemand,
      //   theoreticalMaxPowerDemand: simResult.theoreticalMaxPowerDemand,
      //   concurrencyFactor: simResult.concurrencyFactor,
      //   dataPoints: this.convertDataPoints(simResult)
      // };
      // -------------------------------------------------------------

      // For now, use our simulation model that mimics Task 1 behavior
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate data points (15-minute intervals over 24 hours = 96 points)
      const dataPoints = SimulationService.generateDataPoints(params);

      // Calculate metrics
      const totalEnergyConsumed =
        SimulationService.calculateTotalEnergy(dataPoints);
      const maxPowerDemand = Math.max(
        ...dataPoints.map((point) => point.powerConsumption)
      );
      const theoreticalMaxPowerDemand =
        params.numChargePoints * params.chargePower;
      const concurrencyFactor =
        (maxPowerDemand / theoreticalMaxPowerDemand) * 100;

      // Return formatted results
      return {
        totalEnergyConsumed,
        actualMaxPowerDemand: maxPowerDemand,
        theoreticalMaxPowerDemand,
        concurrencyFactor,
        dataPoints,
      };
    } catch (error) {
      console.error("Simulation error:", error);
      throw new Error("Failed to run simulation. Check console for details.");
    }
  }

  /**
   * Generate EV arrival probability for given hour (0-23)
   */
  private static getEVArrivalProbability(
    hourIndex: number,
    multiplier = 1
  ): number {
    if (hourIndex < 0 || hourIndex > 23) {
      throw new Error("Hour index must be between 0 and 23");
    }
    return ARRIVAL_PROBABILITY_BY_HOUR[hourIndex] * multiplier;
  }

  /**
   * Generate charging demand in kilometers based on probability distribution
   */
  private static getEVChargingDemand(): number {
    const rnd = Math.random() * 100;
    let cumulativeProbability = 0;

    for (const { probability, demand } of CHARGING_DEMAND) {
      cumulativeProbability += probability;
      if (rnd <= cumulativeProbability) return demand;
    }

    return 0; // fallback
  }

  /**
   * Generate data points based on simulation parameters with more realistic distribution
   */
  private static generateDataPoints(params: SimulationParams): DataPoint[] {
    const dataPoints: DataPoint[] = [];
    const now = new Date();

    // Track active chargepoints individually for better event tracking
    const activeChargepoints: number[] = Array(params.numChargePoints).fill(0);

    // Generate 96 data points (15-minute intervals over 24 hours)
    for (let i = 0; i < 96; i++) {
      const timestamp = new Date(now);
      timestamp.setHours(0, 0, 0, 0); // Start at midnight
      timestamp.setMinutes(i * 15); // 15-minute intervals

      const hour = timestamp.getHours();

      // Process each chargepoint for this tick
      for (let j = 0; j < activeChargepoints.length; j++) {
        // Decrease remaining time for active chargepoints
        if (activeChargepoints[j] > 0) {
          activeChargepoints[j] = activeChargepoints[j] - 1;
        }
        // Check for new EV arrival for inactive chargepoints
        else {
          // Apply arrival probability adjusted by multiplier
          const probabilityMultiplier =
            params.arrivalProbabilityMultiplier / 100;
          const intervalProbability =
            this.getEVArrivalProbability(hour, probabilityMultiplier) / 4; // divide by 4 for 15-min intervals

          // Check if a new EV arrives during this tick - higher probability for more events
          // Adjust probability to ensure multiple events throughout the day
          const arrivalFactor = hour >= 8 && hour <= 20 ? 3 : 1; // Higher during day

          if (Math.random() * 100 < intervalProbability * arrivalFactor) {
            // Generate charging demand based on probability distribution
            const demandKm = this.getEVChargingDemand();

            if (demandKm > 0) {
              // Calculate energy demand based on EV consumption
              const energyDemand = (demandKm / 100) * params.evConsumption; // kWh
              // Convert to charging duration (in 15-minute ticks)
              const chargingDuration = Math.max(
                1,
                Math.ceil((energyDemand / params.chargePower) * 4)
              );
              // Set the chargepoint as active for this duration
              activeChargepoints[j] = chargingDuration;
            }
          }
        }
      }

      // Count active chargepoints and calculate power consumption
      const numActivePoints = activeChargepoints.filter(
        (time) => time > 0
      ).length;
      const powerConsumption = numActivePoints * params.chargePower;

      // Add data point
      dataPoints.push({
        timestamp,
        powerConsumption,
        numActiveChargePoints: numActivePoints,
      });
    }

    return dataPoints;
  }

  /**
   * Calculate total energy consumed in kWh
   */
  private static calculateTotalEnergy(dataPoints: DataPoint[]): number {
    // Each data point is a 15-minute interval (1/4 hour)
    return dataPoints.reduce(
      (sum, point) => sum + point.powerConsumption / 4,
      0
    );
  }
}
