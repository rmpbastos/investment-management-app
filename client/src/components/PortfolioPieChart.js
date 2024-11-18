// import React, { useEffect, useRef } from "react";
// import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

// // Register required Chart.js components
// Chart.register(PieController, ArcElement, Tooltip, Legend);

// const PortfolioPieChart = ({ portfolio }) => {
//   const chartRef = useRef(null);
//   const chartInstance = useRef(null);

//   // Function to render the donut chart
//   const renderChart = () => {
//     const ctx = chartRef.current.getContext("2d");

//     // Destroy any existing chart instance to avoid "Canvas is already in use" error
//     if (chartInstance.current) {
//       chartInstance.current.destroy();
//     }

//     // Prepare data for the donut chart
//     const labels = portfolio.map((stock) => stock.ticker);
//     const data = portfolio.map((stock) => stock.totalQuantity);

//     // Define colors for the donut chart segments
//     const backgroundColors = [
//       "#FF6384",
//       "#36A2EB",
//       "#FFCE56",
//       "#4BC0C0",
//       "#9966FF",
//       "#FF9F40",
//     ];

//     // Create a new donut chart instance
//     chartInstance.current = new Chart(ctx, {
//       type: "pie",
//       data: {
//         labels,
//         datasets: [
//           {
//             label: "Portfolio Distribution",
//             data,
//             backgroundColor: backgroundColors.slice(0, labels.length), // Use as many colors as needed
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: "bottom",
//           },
//           tooltip: {
//             callbacks: {
//               label: (tooltipItem) => {
//                 const label = tooltipItem.label || "";
//                 const value = tooltipItem.raw || 0;
//                 return `${label}: ${value}`;
//               },
//             },
//           },
//         },
//         // Add this line for the donut chart
//         cutout: "50%", // This creates a hole in the middle (50% of the radius)
//       },
//     });
//   };

//   // UseEffect to render the chart when the component mounts or portfolio data changes
//   useEffect(() => {
//     if (portfolio.length > 0) {
//       renderChart();
//     }

//     // Cleanup function to destroy the chart on component unmount
//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, [portfolio]);

//   return (
//     <div className="w-full md:w-1/2 lg:w-1/3 p-4">
//       <h3 className="text-lg font-semibold mb-2">Portfolio Distribution</h3>
//       <canvas ref={chartRef} />
//     </div>
//   );
// };

// export default PortfolioPieChart;




// import React, { useEffect, useRef } from "react";
// import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

// // Register required Chart.js components
// Chart.register(PieController, ArcElement, Tooltip, Legend);

// const PortfolioPieChart = ({ portfolio }) => {
//   const chartRef = useRef(null);
//   const chartInstance = useRef(null);

//   // Function to render the pie chart
//   const renderChart = () => {
//     const ctx = chartRef.current.getContext("2d");

//     // Destroy any existing chart instance to avoid "Canvas is already in use" error
//     if (chartInstance.current) {
//       chartInstance.current.destroy();
//     }

//     // Prepare data for the pie chart
//     const labels = portfolio.map((stock) => stock.ticker);
//     const data = portfolio.map((stock) => {
//       const currentPrice = stock.currentPrice || 0;
//       const totalValue = currentPrice * stock.totalQuantity;
//       console.log(`Ticker: ${stock.ticker}, Current Price: ${currentPrice}, Total Value: ${totalValue}`);
//       return totalValue;
//     });

//     // Check if all data values are zero
//     const totalSum = data.reduce((sum, value) => sum + value, 0);
//     if (totalSum === 0) {
//       console.warn("All data values are zero. Cannot render pie chart.");
//       return;
//     }

//     // Define colors for the pie chart segments
//     const backgroundColors = [
//       "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
//     ];

//     // Log the chart data for debugging
//     console.log("Pie chart data:", data);

//     // Create a new pie chart instance
//     chartInstance.current = new Chart(ctx, {
//       type: "pie",
//       data: {
//         labels,
//         datasets: [
//           {
//             label: "Portfolio Distribution",
//             data,
//             backgroundColor: backgroundColors.slice(0, labels.length),
//             borderWidth: 1,
//             borderColor: "#ffffff",
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: "bottom",
//           },
//           tooltip: {
//             callbacks: {
//               label: (tooltipItem) => {
//                 const label = tooltipItem.label || "";
//                 const value = tooltipItem.raw || 0;
//                 const percentage = ((value / totalSum) * 100).toFixed(2);
//                 return `${label}: $${value.toFixed(2)} (${percentage}%)`;
//               },
//             },
//           },
//         },
//         cutout: "50%", // Creates a donut effect with a hole in the center
//         animation: {
//           animateScale: true,
//           animateRotate: true,
//         },
//       },
//     });
//   };

//   // useEffect to render the chart when the component mounts or portfolio data changes
//   useEffect(() => {
//     if (portfolio.length > 0) {
//       renderChart();
//     }

//     // Cleanup function to destroy the chart on component unmount
//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, [portfolio]);

//   return (
//     <div className="w-full md:w-1/2 lg:w-1/3 p-4">
//       <h3 className="text-lg font-semibold mb-2">Portfolio Distribution</h3>
//       <canvas ref={chartRef} />
//     </div>
//   );
// };

// export default PortfolioPieChart;



// import React, { useEffect, useRef } from "react";
// import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";


// // Register required Chart.js components
// Chart.register(PieController, ArcElement, Tooltip, Legend);

// const PortfolioPieChart = ({ portfolio }) => {
//   const chartRef = useRef(null);
//   const chartInstance = useRef(null);

//   // Function to render the pie chart
//   const renderChart = () => {
//     const ctx = chartRef.current.getContext("2d");

//     // Destroy any existing chart instance to avoid "Canvas is already in use" error
//     if (chartInstance.current) {
//       chartInstance.current.destroy();
//     }

//     // Prepare data for the pie chart
//     const labels = portfolio.map((stock) => stock.ticker);
//     const data = portfolio.map((stock) => {
//       const currentPrice = stock.currentPrice || 0;
//       const totalValue = currentPrice * stock.totalQuantity;
//       console.log(`Ticker: ${stock.ticker}, Current Price: ${currentPrice}, Total Value: ${totalValue}`);
//       return totalValue;
//     });

//     // Check if all data values are zero
//     const totalSum = data.reduce((sum, value) => sum + value, 0);
//     if (totalSum === 0) {
//       console.warn("All data values are zero. Cannot render pie chart.");
//       return;
//     }

//     // Define colors for the pie chart segments
//     const backgroundColors = [
//       "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
//     ];

//     // Log the chart data for debugging
//     console.log("Pie chart data:", data);

//     // Create a new pie chart instance
//     chartInstance.current = new Chart(ctx, {
//       type: "pie",
//       data: {
//         labels,
//         datasets: [
//           {
//             label: "Portfolio Distribution",
//             data,
//             backgroundColor: backgroundColors.slice(0, labels.length),
//             borderWidth: 1,
//             borderColor: "#ffffff",
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: "bottom",
//           },
//           tooltip: {
//             callbacks: {
//               label: (tooltipItem) => {
//                 const value = tooltipItem.raw || 0;
//                 const percentage = ((value / totalSum) * 100).toFixed(2);

//                 // Format value with thousand separator
//                 const formattedValue = value.toLocaleString("en-US", {
//                   style: "currency",
//                   currency: "USD",
//                   minimumFractionDigits: 2,
//                 });

//                 // Customize the tooltip label
//                 return `Total: ${formattedValue} (${percentage}%)`;
//               },
//             },
//           },
//         },
//         cutout: "50%", // Creates a donut effect with a hole in the center
//         animation: {
//           animateScale: true,
//           animateRotate: true,
//         },
//       },
//     });
//   };

//   // useEffect to render the chart when the component mounts or portfolio data changes
//   useEffect(() => {
//     if (portfolio.length > 0) {
//       renderChart();
//     }

//     // Cleanup function to destroy the chart on component unmount
//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, [portfolio]);

//   return (
//     <div className="w-full md:w-1/2 lg:w-1/3 p-4">
//       <h3 className="text-lg font-semibold mb-2">Portfolio Distribution</h3>
//       <canvas ref={chartRef} />
//     </div>
//   );
// };

// export default PortfolioPieChart;




import React, { useEffect, useRef } from "react";
import { Chart, PieController, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register required Chart.js components
Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

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
    const data = portfolio.map((stock) => {
      const currentPrice = stock.currentPrice || 0;
      const totalValue = currentPrice * stock.totalQuantity;
      return totalValue;
    });

    // Check if all data values are zero
    const totalSum = data.reduce((sum, value) => sum + value, 0);
    if (totalSum === 0) {
      console.warn("All data values are zero. Cannot render pie chart.");
      return;
    }

    // Define colors for the pie chart segments
    const backgroundColors = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
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
            backgroundColor: backgroundColors.slice(0, labels.length),
            borderWidth: 1,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to grow in size
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "Portfolio Distribution",
            align: "center",
            font: {
              size: 18,
              weight: "bold",
            },
            padding: {
              top: 10,
              bottom: 20,
            },
            color: "#333333",
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw || 0;
                const percentage = ((value / totalSum) * 100).toFixed(2);

                // Format value with thousand separator
                const formattedValue = value.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                });

                return `Total: ${formattedValue} (${percentage}%)`;
              },
            },
          },
        },
        cutout: "40%", // Adjust the donut effect
        animation: {
          animateScale: true,
          animateRotate: true,
        },
      },
    });
  };

  // useEffect to render the chart when the component mounts or portfolio data changes
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
    <div className="w-full max-w-lg p-4 mx-auto">
      <canvas ref={chartRef} style={{ maxHeight: "400px", maxWidth: "100%" }} />
    </div>
  );
};

export default PortfolioPieChart;
