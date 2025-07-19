import React from 'react';

const KPICard = ({ kpi }) => {
  const getProgressPercentage = () => {
    if (kpi.target === 0) return 0;
    return Math.min((kpi.value / kpi.target) * 100, 100);
  };

  const getStatusColor = () => {
    const progress = getProgressPercentage();
    if (progress >= 90) return '#10B981'; // Green
    if (progress >= 70) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <h3>{kpi.name}</h3>
        <span className="kpi-category">{kpi.category}</span>
      </div>
      
      <div className="kpi-value">
        <span className="value">{kpi.value.toLocaleString()}</span>
        <span className="unit">{kpi.unit}</span>
      </div>
      
      {kpi.target > 0 && (
        <div className="kpi-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${getProgressPercentage()}%`,
                backgroundColor: getStatusColor()
              }}
            />
          </div>
          <span className="target-text">
            Target: {kpi.target.toLocaleString()}{kpi.unit}
          </span>
        </div>
      )}
      
      <div className="kpi-timestamp">
        Last updated: {new Date(kpi.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default KPICard;