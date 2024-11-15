import React, { useEffect, useRef } from "react";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
Chart.register(PieController, ArcElement, Tooltip, Legend);

const PortfolioPieChart = ({ portfolio }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Function to render the pie chart
  const renderChart = () => {
    const ctx = chartRef.current.getContext("2d");

    // Destroy any existing chart instance to avoid "Canvas is already in use" error
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Prepare data for the pie chart
    const labels = portfolio.map((stock) => stock.ticker);
    const data = portfolio.map((stock) => stock.totalQuantity);

    // Define colors for the pie chart segments
    const backgroundColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
    ];

    // Create a new pie chart instance
    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: "Portfolio Distribution",
            data,
            backgroundColor: backgroundColors.slice(0, labels.length), // Use as many colors as needed
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            // enabled: true,
          },
        },
      },
    });
  };

  // UseEffect to render the chart when the component mounts or portfolio data changes
  useEffect(() => {
    if (portfolio.length > 0) {
      renderChart();
    }

    // Cleanup function to destroy the chart on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [portfolio]);

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <h3 className="text-lg font-semibold mb-2">Portfolio Distribution</h3>
      <canvas ref={chartRef} />
    </div>
  );
};

export default PortfolioPieChart;
