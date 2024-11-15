// client/src/components/WealthAreaChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WealthAreaChart = ({ totalWealth, totalInvested }) => {
  // Sample data for demonstration
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Using totalWealth and totalInvested as the latest data points
  const data = {
    labels,
    datasets: [
      {
        label: "Total Wealth",
        data: [5000, 5500, 6000, 6200, 6400, 6500, 6600, 7000, 7200, 7300, totalWealth],
        fill: true,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Total Invested",
        data: [4800, 5200, 5700, 6000, 6200, 6300, 6400, 6800, 7000, 7100, totalInvested],
        fill: true,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount ($)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-80">
      <Line data={data} options={options} />
    </div>
  );
};

export default WealthAreaChart;
