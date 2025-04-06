import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

// Using variable names that match our SCSS variables
// The actual colors are defined in styles.scss
export const COLORS = {
  COMPLETED: 'var(--status-completed)',
  INCOMPLETE: 'var(--status-incomplete)',
};

interface StatusIconProps {
  completed: boolean;
  size?: number;
  showLabel?: boolean;
}

const StatusIcon: React.FC<StatusIconProps> = ({
  completed,
  size = 20,
  showLabel = false,
}) => {
  return (
    <>
      <FaCheckCircle
        size={size}
        color={completed ? COLORS.COMPLETED : COLORS.INCOMPLETE}
      />
      {showLabel && (
        <span className="status-label">{completed ? 'DONE' : 'NOT DONE'}</span>
      )}
    </>
  );
};

export default StatusIcon;
