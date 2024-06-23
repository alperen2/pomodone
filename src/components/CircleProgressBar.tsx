import React from 'react';

interface CircleProgressBarProps {
  percent: number;
  strokeColor?: string;
  strokeWidth?: number;
  trailColor?: string;
  size?: number;
  children?: React.ReactNode;
}

const CircleProgressBar: React.FC<CircleProgressBarProps> = ({
  percent,
  strokeColor = '#3e63dd',
  strokeWidth = 10,
  trailColor = '#d9d9d9',
  size = 120,
  children,
}) => {
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          stroke={trailColor}
          strokeWidth={strokeWidth}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="transition-all ease-linear"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default CircleProgressBar;
