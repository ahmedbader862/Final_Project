import React from 'react';
import { Line, Pie } from 'react-chartjs-2';

const ChartsSection = ({ lineChartData, statusPieChartData, paymentPieChartData }) => (
  <div className="row mb-4">
    <div className="col-md-6"><Line data={lineChartData} options={{ responsive: true }} /></div>
    <div className="col-md-3"><Pie data={statusPieChartData} options={{ responsive: true }} /></div>
    <div className="col-md-3"><Pie data={paymentPieChartData} options={{ responsive: true }} /></div>
  </div>
);

export default ChartsSection;