# EV Charging Simulation

A TypeScript implementation of an electric vehicle (EV) charging simulation for a retail store with multiple charging stations, analyzing energy consumption patterns and power demand.

## Overview

This simulation models multiple EV charging stations over time to determine:

- Total energy consumption (kWh)
- Maximum power demand (kW)
- Concurrency factor (ratio of actual vs. theoretical maximum power demand)

The model accounts for:

- Probability-based EV arrivals varying by hour of day
- Randomized charging demand following a realistic distribution
- 15-minute interval time steps over a full year

## Installation

```bash
# Install dependencies
npm install
```

## Running the Simulation

```bash
# Run the simulation
npm start

# Run in development mode (with auto-restart)
npm run dev

# Build the project
npm run build
```

## Implementation Approach

The simulation follows an object-oriented approach with:

1. **Chargepoint Class**: Models individual charging stations

   - Tracks occupation state, charging time, and energy consumption
   - Handles charging events and time advancement

2. **Probability Utilities**:

   - Implements realistic EV arrival patterns by hour of day
   - Generates charging demands based on probability distribution

3. **Simulation Engine**:
   - Models time in 15-minute intervals over a full year
   - Processes EV arrivals and charging events
   - Calculates energy consumption and power demand metrics

## Project Structure

```
src/
├── models/
│   ├── chargepoint.ts  # Chargepoint class implementation
│   └── types.ts        # TypeScript interfaces and types
├── utils/
│   └── probability.ts  # Probability calculation utilities
├── constants.ts        # Configuration constants
├── simulation.ts       # Core simulation logic
├── index.ts            # Main entry point
└── __tests__/          # Test suite
    ├── chargepoint.test.ts
    ├── probability.test.ts
    ├── simulation.test.ts
    └── constants.test.ts
```

## Testing

The project includes a comprehensive test suite using Jest:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

Tests cover:

- Unit tests for the Chargepoint class
- Verification of probability distributions
- Integration tests for the simulation engine
- Validation of calculation accuracy

## Results

The simulation provides insights into:

- Energy consumption patterns over time
- Peak power demand occurrences
- Required capacity planning for charging infrastructure

Sample output:

```
|======= EV Charging Simulation =======|
Task 1: simulating 20 chargepoints with 11kw for 1 year (365 days)

Simulation Results:
Total energy consumed: 123456.78 kWh
Theoretical maximum power demand: 220 kW
Actual maximum power demand: 110.00 kW
Concurrency factor: 50.00%
========================================
```

## Bonus Tasks

The implementation includes:

- Analysis of concurrency factor behavior with 1-30 chargepoints
