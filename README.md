# EV Charging Simulation Project

This repository contains a comprehensive electric vehicle (EV) charging simulation project, divided into two parts: a backend simulation engine (Task 1) and a frontend visualization dashboard (Task 2).

## Project Structure

```
project/
├── task_1/             # Backend simulation engine
│   ├── src/            # Simulation source code
│   ├── dist/           # Compiled JavaScript
│   ├── README.md       # Task 1 documentation
│   └── package.json    # Dependencies for Task 1
│
└── task_2a/            # Frontend visualization
    ├── src/            # React components and services
    ├── public/         # Static assets
    ├── README.md       # Task 2a documentation
    └── package.json    # Dependencies for Task 2
```

## Task 1: Simulation Engine

The first task implements a simulation engine that models EV charging behavior at parking facilities. It simulates multiple chargepoints over extended periods, analyzing patterns of use, energy consumption, and power demand.

**Key Features:**

- Simulates 20 chargepoints with 11kW power over a one-year period
- Uses probability distributions for EV arrivals and charging needs
- Calculates total energy consumption, maximum power demand, and concurrency factor
- Includes a bonus analysis of how concurrency factor changes with number of chargepoints

See the [Task 1 README](./task_1/README.md) for detailed information on the simulation engine implementation.

## Task 2a: Frontend Visualization

The second task creates a frontend dashboard for visualizing simulation results. It provides an interactive interface to run simulations with different parameters and view the results through intuitive charts and metrics.

**Key Features:**

- Interactive controls to configure simulation parameters
- Visualization of power consumption and active chargepoints
- Analysis of charging events over day/week/month/year
- Summary view of key simulation metrics
- Responsive design for various screen sizes

See the [Task 2a README](./task_2a/README.md) for detailed information on the frontend implementation.

## Getting Started

### Running Task 1 (Simulation Engine)

```bash
cd task_1
npm install
npm run build
npm start
```

### Running Task 2a (Frontend)

```bash
cd task_2a
npm install
npm run dev
```

Then open your browser and navigate to `http://localhost:3000`.

## Technologies Used

- **TypeScript**: For type-safe code across both parts
- **Node.js**: Backend runtime for the simulation engine
- **React**: Frontend UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Composable chart library for visualization
- **Vite**: Build tooling for the frontend

## Project Requirements

This project was built according to specified requirements for simulating and visualizing EV charging infrastructure. The two tasks address different aspects of the same problem:

1. **Task 1**: Simulating chargepoint usage to understand energy needs and power demand
2. **Task 2a**: Visualizing the simulation results to make data-driven infrastructure decisions
