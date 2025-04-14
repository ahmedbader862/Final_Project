import React from 'react';
import { Line, Pie } from 'react-chartjs-2';

const ChartsSection = ({ lineChartData, statusPieChartData, paymentPieChartData }) => (
  <div className="charts-section row g-4 mb-5">
    <div className="col-md-6">
      <div className="chart-card">
        <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
    <div className="col-md-3">
      <div className="chart-card">
        <Pie data={statusPieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
    <div className="col-md-3">
      <div className="chart-card">
        <Pie data={paymentPieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  </div>
);

export default ChartsSection;