// client/src/components/WealthAreaChart.js
// import React, { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";
// import axios from "axios";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const WealthAreaChart = ({ userId }) => {
//   const [labels, setLabels] = useState([]);
//   const [totalWealthData, setTotalWealthData] = useState([]);
//   const [totalInvestedData, setTotalInvestedData] = useState([]);

//   // Function to fetch wealth history data
//   const fetchWealthHistory = async () => {
//     try {
//       const response = await axios.get(`/api/total-wealth/history/${userId}`);
//       const data = response.data;

//       // Extract labels and data points
//       const labels = data.map((entry) =>
//         new Date(entry.calculationDate).toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "short",
//         })
//       );
//       const totalWealthData = data.map((entry) => entry.totalWealth);
//       const totalInvestedData = data.map((entry) => entry.totalInvested);

//       setLabels(labels);
//       setTotalWealthData(totalWealthData);
//       setTotalInvestedData(totalInvestedData);
//     } catch (error) {
//       console.error("Error fetching wealth history:", error);
//     }
//   };

//   useEffect(() => {
//     fetchWealthHistory();
//   }, [userId]);

//   // Chart data
//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Total Wealth",
//         data: totalWealthData,
//         fill: true,
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         tension: 0.4,
//       },
//       {
//         label: "Total Invested",
//         data: totalInvestedData,
//         fill: true,
//         borderColor: "rgba(255, 99, 132, 1)",
//         backgroundColor: "rgba(255, 99, 132, 0.2)",
//         tension: 0.4,
//       },
//     ],
//   };

//   // Chart options
//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Month",
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: "Amount ($)",
//         },
//         beginAtZero: true,
//         ticks: {
//           // Automatically adjust the y-axis scale based on the data range
//           callback: (value) => `$${value.toLocaleString("en-US")}`,
//         },
//       },
//     },
//   };

//   return (
//     <div className="w-full h-80">
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default WealthAreaChart;





// client/src/components/WealthAreaChart.js
// import React, { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";
// import axios from "axios";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const WealthAreaChart = ({ userId }) => {
//   const [labels, setLabels] = useState([]);
//   const [totalWealthData, setTotalWealthData] = useState([]);
//   const [totalInvestedData, setTotalInvestedData] = useState([]);

//   // Function to fetch wealth history data
//   const fetchWealthHistory = async () => {
//     try {
//       const response = await axios.get(`/api/total-wealth/history/${userId}`);
//       const data = response.data;

//       // Check if there is data available
//       if (data.length === 0) {
//         console.warn("No wealth history data found for the user.");
//         return;
//       }

//       // Extract labels and data points
//       const labels = data.map((entry) =>
//         new Date(entry.calculationDate).toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "short",
//         })
//       );
//       const totalWealthData = data.map((entry) => entry.totalWealth);
//       const totalInvestedData = data.map((entry) => entry.totalInvested);

//       setLabels(labels);
//       setTotalWealthData(totalWealthData);
//       setTotalInvestedData(totalInvestedData);
//     } catch (error) {
//       console.error("Error fetching wealth history:", error);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchWealthHistory();
//     }
//   }, [userId]);

//   // Chart data
//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Total Wealth",
//         data: totalWealthData,
//         fill: true,
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         tension: 0.4,
//       },
//       {
//         label: "Total Invested",
//         data: totalInvestedData,
//         fill: true,
//         borderColor: "rgba(255, 99, 132, 1)",
//         backgroundColor: "rgba(255, 99, 132, 0.2)",
//         tension: 0.4,
//       },
//     ],
//   };

//   // Chart options
//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Month",
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: "Amount ($)",
//         },
//         beginAtZero: true,
//         ticks: {
//           // Automatically adjust the y-axis scale based on the data range
//           callback: (value) => `$${value.toLocaleString("en-US")}`,
//         },
//       },
//     },
//   };

//   return (
//     <div className="w-full h-80">
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default WealthAreaChart;




// client/src/components/WealthAreaChart.js
// import React, { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
// import axios from "axios";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";
// import { useAuth } from "../context/UserContext";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const WealthAreaChart = () => {
//   const { currentUser } = useAuth();
//   const [chartData, setChartData] = useState(null);

//   useEffect(() => {
//     const fetchWealthHistory = async () => {
//       try {
//         const response = await axios.get(
//           `/api/total-wealth/history/${currentUser.uid}`
//         );
//         const wealthData = response.data;

//         // Extract labels, total wealth, and total invested
//         const labels = wealthData.map((entry) =>
//           new Date(entry.calculationDate).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//           })
//         );
//         const totalWealthData = wealthData.map((entry) => entry.totalWealth);
//         const totalInvestedData = wealthData.map((entry) => entry.totalInvested);

//         // Prepare data for the chart
//         const data = {
//           labels,
//           datasets: [
//             {
//               label: "Total Wealth",
//               data: totalWealthData,
//               fill: true,
//               borderColor: "rgba(75, 192, 192, 1)",
//               backgroundColor: "rgba(75, 192, 192, 0.2)",
//               tension: 0.4,
//             },
//             {
//               label: "Total Invested",
//               data: totalInvestedData,
//               fill: true,
//               borderColor: "rgba(255, 99, 132, 1)",
//               backgroundColor: "rgba(255, 99, 132, 0.2)",
//               tension: 0.4,
//             },
//           ],
//         };

//         setChartData(data);
//       } catch (error) {
//         console.error("Error fetching wealth history:", error);
//       }
//     };

//     if (currentUser) {
//       fetchWealthHistory();
//     }
//   }, [currentUser]);

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Month",
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: "Amount ($)",
//         },
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div className="w-full h-80">
//       {chartData ? (
//         <Line data={chartData} options={options} />
//       ) : (
//         <p>Loading chart data...</p>
//       )}
//     </div>
//   );
// };

// export default WealthAreaChart;





import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useAuth } from "../context/UserContext";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WealthAreaChart = () => {
  const { currentUser } = useAuth();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchWealthHistory = async () => {
      try {
        const response = await axios.get(
          `/api/total-wealth/history/${currentUser.uid}`
        );
        const wealthData = response.data;

        // Extract labels, total wealth, and total invested
        const labels = wealthData.map((entry) =>
          new Date(entry.calculationDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })
        );
        const totalWealthData = wealthData.map((entry) => entry.totalWealth);
        const totalInvestedData = wealthData.map((entry) => entry.totalInvested);

        // Prepare data for the chart
        const data = {
          labels,
          datasets: [
            {
              label: "Total Wealth",
              data: totalWealthData,
              fill: true,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
            },
            {
              label: "Total Invested",
              data: totalInvestedData,
              fill: true,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.4,
            },
          ],
        };

        setChartData(data);
      } catch (error) {
        console.error("Error fetching wealth history:", error);
      }
    };

    if (currentUser) {
      fetchWealthHistory();
    }
  }, [currentUser]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Wealth and Investment History",
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
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default WealthAreaChart;
