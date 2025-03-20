# Tonnage Calculator

A professional engineering application for calculating and visualizing tonnage requirements for metal forming operations.

## Features

- Calculates required tonnage for various metal forming operations (perimeter cutting, holes, bends, forms, draws)
- Enhanced data visualization using Recharts
- Tool wear prediction and lifecycle analysis
- Material properties and temperature effects visualization
- Surface finish prediction with specialized lubricant options
- Professional engineering-focused UI with status indicators and engineering tolerances

## Installation

1. Clone the repository:
```
git clone https://github.com/PJdroopyPants/tonnage-calculator.git
cd tonnage-calculator
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

## Data Visualization Features

### Force Distribution Diagrams
- Visualizes force distribution along bending operations
- Shows material yield points and critical thresholds
- Interactive tooltips with precise force values

### Tool Wear Analysis
- Comparative charts for different operations' tool wear rates
- Production rate impact analysis
- Lifecycle cost analysis and economic breakdown

### Temperature Effects
- Interactive charts showing how temperature affects material properties
- Visual indicators for approaching material limits
- Material property radar charts for quick comparison

## Usage

1. Select material, thickness, and temperature parameters
2. Choose operation types (perimeter, holes, bends, forms, or draws)
3. Adjust operation-specific parameters
4. View detailed results with force requirements and visualization
5. Analyze tool wear predictions and economic impact

## Technical Stack

- React
- Redux for state management
- Emotion CSS for styling
- Recharts for data visualization
- Chakra UI components

## Development

To build for production:
```
npm run build
```

To run tests:
```
npm test
```

## License

[MIT License](LICENSE) 