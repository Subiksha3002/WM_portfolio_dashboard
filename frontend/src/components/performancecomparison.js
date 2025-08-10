import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function PerformanceComparison() {
  const [data, setData] = useState({ timeline: [], returns: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch performance data from backend
  const fetchPerformanceData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/performance/", {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0ODQwNjAyLCJpYXQiOjE3NTQ4MjI2MDIsImp0aSI6IjdmOGFjY2YxZmJmYTQ1YTdiMTkxMmRkOWMxMzAyM2Q1IiwidXNlcl9pZCI6IjEifQ.-JTopW0XMb7nQscX8mO2ju5zPXHzTw9yFrpN_rsEqmY",
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
    fetchPerformanceData();
  }, []);

  if (loading) return <div>Loading performance data...</div>;
  if (error) return <div>Error: {error}</div>;

  const { timeline, returns } = data;

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Performance Comparison</h2>

      {/* Timeline Chart */}
      <div style={{ width: "100%", height: 350, marginBottom: 40 }}>
        <ResponsiveContainer>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="portfolio"
              name="Portfolio"
              stroke="#8884d8"
              connectNulls={true}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="nifty50"
              name="Nifty 50"
              stroke="#82ca9d"
              connectNulls={true}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="gold"
              name="Gold"
              stroke="#ffc658"
              connectNulls={true}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div style={{ display: "flex", justifyContent: "space-around", maxWidth: 700, margin: "0 auto" }}>
        {["portfolio", "nifty50", "gold"].map((key) => (
          <div
            key={key}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
              width: "30%",
              textAlign: "center",
            }}
          >
            <h3 style={{ textTransform: "capitalize" }}>{key}</h3>
            <p>1 Month: {returns[key]?.["1month"] ?? "N/A"}</p>
            <p>3 Months: {returns[key]?.["3months"] ?? "N/A"}</p>
            <p>1 Year: {returns[key]?.["1year"] ?? "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
