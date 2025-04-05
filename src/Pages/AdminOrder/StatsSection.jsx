import React from 'react';

const StatsSection = ({ totalOrders, totalRevenue, avgOrderValue, pendingOrders }) => (
  <div className="row mb-4">
    {[
      { title: "Total Orders", value: totalOrders },
      { title: "Total Revenue", value: `${totalRevenue} LE` },
      { title: "Average Order Value", value: `${avgOrderValue} LE` },
      { title: "Pending Orders", value: pendingOrders }
    ].map((stat, idx) => (
      <div key={idx} className="col-md-3">
        <div className="card shadow-sm text-center">
          <div className="card-body">
            <h5>{stat.title}</h5>
            <p className="display-6">{stat.value}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default StatsSection;