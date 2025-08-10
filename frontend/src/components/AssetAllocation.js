import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EFF",
  "#FF6699",
  "#33CC33",
];

export default function AssetAllocation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch portfolio data from backend
  const fetchPortfolioData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/allocation/", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0ODQwNjAyLCJpYXQiOjE3NTQ4MjI2MDIsImp0aSI6IjdmOGFjY2YxZmJmYTQ1YTdiMTkxMmRkOWMxMzAyM2Q1IiwidXNlcl9pZCI6IjEifQ.-JTopW0XMb7nQscX8mO2ju5zPXHzTw9yFrpN_rsEqmY",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  if (loading) return <div>Loading portfolio data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found.</div>;

  // Transform sector data from object to array for chart
  const sectorData = Object.entries(data.bySector || {}).map(
    ([sector, info]) => ({
      name: sector,
      value: info.value,
      percentage: info.percentage,
    })
  );

  // Transform market cap data from object to array for chart
  const marketCapData = Object.entries(data.byMarketCap || {}).map(
    ([cap, info]) => ({
      name: cap,
      value: info.value,
      percentage: info.percentage,
    })
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Asset Allocation Visualizations</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {/* Sector Distribution Pie Chart */}
        <div style={{ width: "45%", minWidth: 300, marginBottom: 40 }}>
          <h3 style={{ textAlign: "center" }}>Sector Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={(entry) => entry.name}
              >
                {sectorData.map((entry, index) => (
                  <Cell
                    key={`cell-sector-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  `₹${value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}`
                }
                // Optional: show name and percentage
                // content={({ payload }) => <div>{payload[0].name}</div>}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Market Cap Distribution Pie Chart */}
        <div style={{ width: "45%", minWidth: 300, marginBottom: 40 }}>
          <h3 style={{ textAlign: "center" }}>Market Cap Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketCapData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label={(entry) => entry.name}
              >
                {marketCapData.map((entry, index) => (
                  <Cell
                    key={`cell-marketcap-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  `₹${value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}`
                }
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
