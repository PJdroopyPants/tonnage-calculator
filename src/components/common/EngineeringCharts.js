import React from 'react';
import styled from '@emotion/styled';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine, Scatter, ScatterChart,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { colors, spacing, typography } from '../../assets/theme';

// Styled container for all charts
const ChartContainer = styled.div`
  width: 100%;
  height: ${({ height }) => height || '300px'};
  margin: ${spacing.md} 0;
`;

// Custom tooltip with engineering styling
const StyledTooltip = styled.div`
  background-color: ${colors.neutral.white};
  border: 1px solid ${colors.neutral.extraLightGrey};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const TooltipLabel = styled.div`
  font-weight: ${typography.fontWeights.semiBold};
  margin-bottom: ${spacing.xs};
  color: ${colors.neutral.darkGrey};
  font-size: ${typography.sizes.sm};
`;

const TooltipItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing.xs};
  font-size: ${typography.sizes.xs};
`;

const TooltipColor = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: ${spacing.xs};
`;

// Custom legend with engineering styling
const StyledLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: ${spacing.sm};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${spacing.md};
  font-size: ${typography.sizes.xs};
  cursor: pointer;
  opacity: ${props => props.inactive ? 0.5 : 1};
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
  margin-right: ${spacing.xs};
`;

// General chart styles
const chartColors = [
  colors.primary.main,
  colors.status.success.main,
  colors.status.warning.main,
  colors.status.danger.main,
  colors.status.info.main,
  colors.secondary.main,
  colors.primary.dark,
  colors.status.success.dark,
];

const gridStyle = {
  strokeDasharray: '3 3',
  stroke: colors.neutral.lightGrey,
};

const axisStyle = {
  fontSize: 12,
  fontFamily: typography.fontFamily,
  color: colors.neutral.mediumGrey,
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <StyledTooltip>
      <TooltipLabel>{label}</TooltipLabel>
      {payload.map((entry, index) => (
        <TooltipItem key={index}>
          <TooltipColor color={entry.color} />
          <span>{`${entry.name}: ${entry.value.toLocaleString()}`}</span>
        </TooltipItem>
      ))}
    </StyledTooltip>
  );
};

// Custom legend component 
const CustomLegend = ({ payload, activeSeries, onSeriesToggle }) => {
  if (!payload) return null;
  
  return (
    <StyledLegend>
      {payload.map((entry, index) => (
        <LegendItem 
          key={index} 
          inactive={activeSeries && !activeSeries.includes(entry.dataKey)}
          onClick={() => onSeriesToggle && onSeriesToggle(entry.dataKey)}
        >
          <LegendColor color={entry.color} />
          <span>{entry.value}</span>
        </LegendItem>
      ))}
    </StyledLegend>
  );
};

// Component for force distribution diagrams
const ForceDistributionChart = ({ 
  data, 
  xAxisLabel = 'Position', 
  yAxisLabel = 'Force (kN)',
  height = '300px',
  referenceLines = [], 
  legendLabels = {}
}) => {
  return (
    <ChartContainer height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid {...gridStyle} />
          <XAxis 
            dataKey="position" 
            {...axisStyle} 
            label={{ 
              value: xAxisLabel, 
              position: 'insideBottom', 
              offset: -10,
              fontSize: 12,
              fill: colors.neutral.darkGrey
            }} 
          />
          <YAxis 
            {...axisStyle} 
            label={{ 
              value: yAxisLabel, 
              angle: -90, 
              position: 'insideLeft',
              fontSize: 12,
              fill: colors.neutral.darkGrey
            }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          
          <Area 
            type="monotone" 
            dataKey="force" 
            name={legendLabels.force || "Force"} 
            stroke={colors.primary.main} 
            fill={colors.primary.lightest} 
            activeDot={{ r: 6 }} 
          />
          
          {referenceLines.map((line, index) => (
            <ReferenceLine 
              key={index}
              y={line.value} 
              label={line.label}
              stroke={line.color || colors.status.warning.main} 
              strokeDasharray={line.dashed ? "3 3" : ""}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Component for tool wear analysis charts
const ToolWearComparisonChart = ({ 
  data, 
  xAxisLabel = 'Operations', 
  yAxisLabel = 'Wear (%)',
  height = '300px',
  legendLabels = {}
}) => {
  return (
    <ChartContainer height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid {...gridStyle} />
          <XAxis 
            dataKey="operationName" 
            {...axisStyle} 
            label={{ 
              value: xAxisLabel, 
              position: 'insideBottom', 
              offset: -10,
              fontSize: 12,
              fill: colors.neutral.darkGrey
            }} 
          />
          <YAxis 
            {...axisStyle} 
            label={{ 
              value: yAxisLabel, 
              angle: -90, 
              position: 'insideLeft',
              fontSize: 12,
              fill: colors.neutral.darkGrey
            }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          
          <Bar 
            dataKey="currentWear" 
            name={legendLabels.currentWear || "Current Wear"} 
            fill={colors.primary.main} 
          />
          <Bar 
            dataKey="projectedWear" 
            name={legendLabels.projectedWear || "Projected Wear"} 
            fill={colors.status.warning.main} 
          />
          <ReferenceLine y={80} stroke={colors.status.danger.main} strokeDasharray="3 3" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Component for material properties temperature effect visualization
const TemperatureEffectChart = ({ 
  data, 
  xAxisLabel = 'Temperature (°C)', 
  yAxisLabel = 'Property Value',
  height = '300px',
  legendLabels = {}
}) => {
  return (
    <ChartContainer height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid {...gridStyle} />
          <XAxis 
            dataKey="temperature" 
            {...axisStyle} 
            label={{ 
              value: xAxisLabel, 
              position: 'insideBottom', 
              offset: -10,
              fontSize: 12,
              fill: colors.neutral.darkGrey
            }} 
          />
          <YAxis 
            {...axisStyle} 
            label={{ 
              value: yAxisLabel, 
              angle: -90, 
              position: 'insideLeft',
              fontSize: 12,
              fill: colors.neutral.darkGrey
            }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          
          <Line 
            type="monotone" 
            dataKey="tensileStrength" 
            name={legendLabels.tensileStrength || "Tensile Strength"} 
            stroke={colors.primary.main} 
            dot={{ fill: colors.primary.main, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="yieldStrength" 
            name={legendLabels.yieldStrength || "Yield Strength"} 
            stroke={colors.status.success.main} 
            dot={{ fill: colors.status.success.main, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="elongation" 
            name={legendLabels.elongation || "Elongation"} 
            stroke={colors.status.info.main} 
            dot={{ fill: colors.status.info.main, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Material property radar chart
const MaterialPropertyRadarChart = ({
  data,
  height = '300px'
}) => {
  return (
    <ChartContainer height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="80%" data={data}>
          <PolarGrid strokeDasharray="3 3" stroke={colors.neutral.lightGrey} />
          <PolarAngleAxis dataKey="property" tick={{ fill: colors.neutral.darkGrey, fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Material Properties"
            dataKey="value"
            stroke={colors.primary.main}
            fill={colors.primary.lightest}
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Scatter plot for data correlation
const DataCorrelationChart = ({
  data,
  xAxisDataKey,
  yAxisDataKey,
  xAxisLabel,
  yAxisLabel,
  height = '300px',
  legendLabel = "Data Points"
}) => {
  return (
    <ChartContainer height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid {...gridStyle} />
          <XAxis 
            dataKey={xAxisDataKey} 
            {...axisStyle} 
            name={xAxisLabel}
            label={{ 
              value: xAxisLabel, 
              position: 'insideBottom', 
              offset: -40,
              fontSize: 12,
              fill: colors.neutral.darkGrey
            }} 
          />
          <YAxis 
            dataKey={yAxisDataKey} 
            {...axisStyle} 
            name={yAxisLabel}
            label={{ 
              value: yAxisLabel, 
              angle: -90, 
              position: 'insideLeft',
              fontSize: 12,
              fill: colors.neutral.darkGrey
            }} 
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Scatter
            name={legendLabel}
            data={data}
            fill={colors.primary.main}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export {
  ForceDistributionChart,
  ToolWearComparisonChart,
  TemperatureEffectChart,
  MaterialPropertyRadarChart,
  DataCorrelationChart,
  ChartContainer,
  CustomTooltip,
  CustomLegend
}; 