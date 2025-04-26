import React from 'react';
import { useSelector } from 'react-redux';

const StatsSection = ({ totalOrders, totalRevenue, avgOrderValue, pendingOrders }) => {
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  return (
    <div className="stats-section row g-4 mb-5">
      {[
        { title: text.totalOrders, value: totalOrders },
        { title: text.totalRevenue, value: `${totalRevenue} LE` },
        { title: text.averageOrderValue, value: `${avgOrderValue} LE` },
        { title: text.pendingOrders, value: pendingOrders },
      ].map((stat, idx) => (
        <div key={idx} className="col-md-3">
          <div className="stat-card">
            <h5 className="stat-label">{stat.title}</h5>
            <p className="stat-value">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;