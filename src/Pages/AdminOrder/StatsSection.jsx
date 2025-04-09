import React from 'react';

const StatsSection = ({ totalOrders, totalRevenue, avgOrderValue, pendingOrders }) => (
  <div className="stats-section row g-4 mb-5">
    {[
      { title: "Total Orders", value: totalOrders },
      { title: "Total Revenue", value: `${totalRevenue} LE` },
      { title: "Average Order Value", value: `${avgOrderValue} LE` },
      { title: "Pending Orders", value: pendingOrders }
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

export default StatsSection;