import React from 'react';
import styled from '@emotion/styled';
import { colors, spacing, typography, borders } from '../../assets/theme';

// Main container for all indicators
const IndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  flex-wrap: wrap;
`;

// Linear gauge indicator
const LinearGaugeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ width }) => width || '300px'};
`;

const GaugeLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${spacing.xs};
  font-size: ${typography.sizes.sm};
  color: ${colors.neutral.mediumGrey};
`;

const GaugeTrack = styled.div`
  height: 8px;
  background-color: ${colors.neutral.extraLightGrey};
  border-radius: ${borders.radius.sm};
  overflow: hidden;
  position: relative;
`;

const GaugeProgress = styled.div`
  height: 100%;
  width: ${({ value, max }) => `${(value / max) * 100}%`};
  background-color: ${({ value, warning, critical }) => {
    if (value >= critical) return colors.status.danger.main;
    if (value >= warning) return colors.status.warning.main;
    return colors.status.success.main;
  }};
  position: relative;
  transition: width 0.3s ease;
`;

const GaugeMarkers = styled.div`
  position: relative;
  height: 16px;
`;

const GaugeMarker = styled.div`
  position: absolute;
  top: 0;
  left: ${({ position, max }) => `${(position / max) * 100}%`};
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MarkerLine = styled.div`
  height: 8px;
  width: 2px;
  background-color: ${({ color }) => color || colors.neutral.mediumGrey};
`;

const MarkerLabel = styled.div`
  font-size: ${typography.sizes.xs};
  color: ${colors.neutral.mediumGrey};
  margin-top: ${spacing.xs};
`;

// Circular gauge for status indicators
const CircularGaugeContainer = styled.div`
  position: relative;
  width: ${({ size }) => size || '120px'};
  height: ${({ size }) => size || '120px'};
`;

const CircularGaugeSvg = styled.svg`
  transform: rotate(-90deg);
`;

const CircularGaugeTrack = styled.circle`
  fill: transparent;
  stroke: ${colors.neutral.extraLightGrey};
  stroke-width: ${({ thickness }) => thickness || 8};
`;

const CircularGaugeProgress = styled.circle`
  fill: transparent;
  stroke: ${({ value, warning, critical }) => {
    if (value >= critical) return colors.status.danger.main;
    if (value >= warning) return colors.status.warning.main;
    return colors.status.success.main;
  }};
  stroke-width: ${({ thickness }) => thickness || 8};
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
`;

const CircularGaugeValue = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${({ fontSize }) => fontSize || typography.sizes.xl};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${({ value, warning, critical }) => {
    if (value >= critical) return colors.status.danger.main;
    if (value >= warning) return colors.status.warning.main;
    return colors.status.success.main;
  }};
  text-align: center;
`;

const CircularGaugeLabel = styled.div`
  position: absolute;
  bottom: -${spacing.lg};
  left: 0;
  right: 0;
  text-align: center;
  font-size: ${typography.sizes.sm};
  color: ${colors.neutral.mediumGrey};
`;

// Material limits warning badge
const LimitWarningBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borders.radius.sm};
  background-color: ${({ status }) => 
    status === 'warning' ? colors.status.warning.bg :
    status === 'danger' ? colors.status.danger.bg :
    status === 'success' ? colors.status.success.bg :
    colors.neutral.extraLightGrey
  };
  color: ${({ status }) => 
    status === 'warning' ? colors.status.warning.dark :
    status === 'danger' ? colors.status.danger.dark :
    status === 'success' ? colors.status.success.dark :
    colors.neutral.darkGrey
  };
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.fontWeights.medium};
  gap: ${spacing.xs};
`;

// Tolerance band indicator
const ToleranceBandContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ width }) => width || '300px'};
`;

const ToleranceBandTrack = styled.div`
  height: 20px;
  background-color: ${colors.neutral.extraLightGrey};
  border-radius: ${borders.radius.sm};
  position: relative;
  overflow: hidden;
`;

const ToleranceBand = styled.div`
  position: absolute;
  top: 0;
  left: ${({ lower, max }) => `${(lower / max) * 100}%`};
  width: ${({ lower, upper, max }) => `${((upper - lower) / max) * 100}%`};
  height: 100%;
  background-color: ${colors.status.success.bg};
  border: 1px solid ${colors.status.success.main};
`;

const ToleranceValue = styled.div`
  position: absolute;
  top: 0;
  left: ${({ value, max }) => `${(value / max) * 100}%`};
  height: 100%;
  width: 2px;
  background-color: ${({ inTolerance }) => 
    inTolerance ? colors.status.success.main : colors.status.danger.main
  };
  
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ inTolerance }) => 
      inTolerance ? colors.status.success.main : colors.status.danger.main
    };
  }
`;

// Confidence level indicator
const ConfidenceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const ConfidenceMeter = styled.div`
  height: 6px;
  width: 100px;
  background-color: ${colors.neutral.extraLightGrey};
  border-radius: ${borders.radius.sm};
  overflow: hidden;
`;

const ConfidenceLevel = styled.div`
  height: 100%;
  width: ${({ level }) => `${level}%`};
  background-color: ${({ level }) => 
    level >= 90 ? colors.status.success.main :
    level >= 70 ? colors.status.info.main :
    level >= 50 ? colors.status.warning.main :
    colors.status.danger.main
  };
`;

const ConfidenceText = styled.span`
  font-size: ${typography.sizes.sm};
  color: ${({ level }) => 
    level >= 90 ? colors.status.success.main :
    level >= 70 ? colors.status.info.main :
    level >= 50 ? colors.status.warning.main :
    colors.status.danger.main
  };
  font-weight: ${typography.fontWeights.medium};
`;

// Safety factor indicator
const SafetyFactorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing.md};
  background-color: ${({ value, minimum }) => 
    value < minimum ? colors.status.danger.bg :
    value < minimum * 1.5 ? colors.status.warning.bg :
    colors.status.success.bg
  };
  border-radius: ${borders.radius.md};
  border-left: ${borders.width.thick} solid ${({ value, minimum }) => 
    value < minimum ? colors.status.danger.main :
    value < minimum * 1.5 ? colors.status.warning.main :
    colors.status.success.main
  };
`;

const SafetyFactorValue = styled.div`
  font-size: ${typography.sizes.xl};
  font-weight: ${typography.fontWeights.bold};
  color: ${({ value, minimum }) => 
    value < minimum ? colors.status.danger.main :
    value < minimum * 1.5 ? colors.status.warning.main :
    colors.status.success.main
  };
`;

const SafetyFactorLabel = styled.div`
  font-size: ${typography.sizes.sm};
  color: ${colors.neutral.mediumGrey};
`;

const SafetyFactorDetails = styled.div`
  font-size: ${typography.sizes.xs};
  color: ${colors.neutral.darkGrey};
  margin-top: ${spacing.sm};
  text-align: center;
`;

// Component definitions
const LinearGauge = ({ 
  value, 
  min = 0, 
  max = 100, 
  warning = 70, 
  critical = 90,
  label,
  unit,
  markers = [],
  width
}) => {
  return (
    <LinearGaugeContainer width={width}>
      <GaugeLabel>
        <span>{label}</span>
        <span>{value}{unit}</span>
      </GaugeLabel>
      <GaugeTrack>
        <GaugeProgress 
          value={value} 
          max={max} 
          warning={warning} 
          critical={critical} 
        />
      </GaugeTrack>
      <GaugeMarkers>
        {markers.map((marker, index) => (
          <GaugeMarker key={index} position={marker.value} max={max}>
            <MarkerLine color={marker.color} />
            <MarkerLabel>{marker.label}</MarkerLabel>
          </GaugeMarker>
        ))}
      </GaugeMarkers>
    </LinearGaugeContainer>
  );
};

const CircularGauge = ({
  value,
  min = 0,
  max = 100,
  warning = 70,
  critical = 90,
  label,
  unit = '%',
  size,
  thickness,
  fontSize
}) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  const dashoffset = circumference - progress;
  
  return (
    <CircularGaugeContainer size={size}>
      <CircularGaugeSvg width="100%" height="100%" viewBox="0 0 120 120">
        <CircularGaugeTrack
          cx="60"
          cy="60"
          r={radius}
          thickness={thickness}
        />
        <CircularGaugeProgress
          cx="60"
          cy="60"
          r={radius}
          thickness={thickness}
          value={value}
          warning={warning}
          critical={critical}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
        />
      </CircularGaugeSvg>
      <CircularGaugeValue 
        value={value} 
        warning={warning} 
        critical={critical}
        fontSize={fontSize}
      >
        {value}{unit}
      </CircularGaugeValue>
      {label && <CircularGaugeLabel>{label}</CircularGaugeLabel>}
    </CircularGaugeContainer>
  );
};

const ToleranceBandIndicator = ({
  value,
  lowerLimit,
  upperLimit,
  max,
  label,
  unit,
  width
}) => {
  const inTolerance = value >= lowerLimit && value <= upperLimit;
  
  return (
    <ToleranceBandContainer width={width}>
      <GaugeLabel>
        <span>{label}</span>
        <span>
          {value}{unit} {inTolerance ? '✓' : '✗'} 
          ({lowerLimit}{unit} - {upperLimit}{unit})
        </span>
      </GaugeLabel>
      <ToleranceBandTrack>
        <ToleranceBand lower={lowerLimit} upper={upperLimit} max={max} />
        <ToleranceValue value={value} max={max} inTolerance={inTolerance} />
      </ToleranceBandTrack>
    </ToleranceBandContainer>
  );
};

const ConfidenceIndicator = ({ level, label }) => {
  return (
    <ConfidenceContainer>
      {label && <span>{label}:</span>}
      <ConfidenceMeter>
        <ConfidenceLevel level={level} />
      </ConfidenceMeter>
      <ConfidenceText level={level}>{level}%</ConfidenceText>
    </ConfidenceContainer>
  );
};

const MaterialLimitWarning = ({ 
  status, 
  children 
}) => {
  return (
    <LimitWarningBadge status={status}>
      {children}
    </LimitWarningBadge>
  );
};

const SafetyFactorIndicator = ({ 
  value, 
  minimum = 1.5, 
  description 
}) => {
  return (
    <SafetyFactorContainer value={value} minimum={minimum}>
      <SafetyFactorLabel>Safety Factor</SafetyFactorLabel>
      <SafetyFactorValue value={value} minimum={minimum}>
        {value.toFixed(2)}
      </SafetyFactorValue>
      {description && (
        <SafetyFactorDetails>
          {description}
        </SafetyFactorDetails>
      )}
    </SafetyFactorContainer>
  );
};

export {
  LinearGauge,
  CircularGauge,
  ToleranceBandIndicator,
  ConfidenceIndicator,
  MaterialLimitWarning,
  SafetyFactorIndicator
}; 