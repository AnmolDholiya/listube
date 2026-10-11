import React from 'react';

export const StatusStamp = ({ status }) => {
  const normalized = (status || 'DRAFT').toUpperCase();

  let colorClass = 'status-draft';
  let label = normalized;

  switch (normalized) {
    case 'PUBLISHED':
      colorClass = 'status-published';
      label = 'PUBLISHED';
      break;
    case 'REJECTED':
      colorClass = 'status-rejected';
      label = 'REJECTED';
      break;
    case 'PENDING':
      colorClass = 'status-pending';
      label = 'PENDING';
      break;
    case 'IN_PROGRESS':
      colorClass = 'status-pending';
      label = 'IN PROGRESS';
      break;
    case 'VALIDATED':
      colorClass = 'text-blue-700 bg-blue-50 border-blue-200';
      label = 'VALIDATED';
      break;
    case 'READY':
      colorClass = 'text-blue-700 bg-blue-50 border-blue-200';
      label = 'READY';
      break;
    case 'DRAFT':
    default:
      colorClass = 'status-draft';
      label = 'DRAFT';
      break;
  }

  return (
    <span className={`status-pill ${colorClass}`}>
      {label}
    </span>
  );
};
