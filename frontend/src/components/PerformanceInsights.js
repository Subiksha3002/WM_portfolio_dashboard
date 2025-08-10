// src/components/PerformanceInsights.js
import React, { useEffect, useState } from "react";

export default function PerformanceInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/summary/", {
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
    fetchPerformanceData();
  }, []);

  if (loading) return <div>Loading performance insights...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No performance data available</div>;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Performance Insights</h2>

      <div style={{ marginBottom: 15 }}>
        <strong>Best Performing Stock:</strong>
        <div>
          {data.topPerformer.symbol} - {data.topPerformer.name} <br />
          Gain:{" "}
          <span style={{ color: "green" }}>
            {data.topPerformer.gainPercent.toFixed(2)}%
          </span>
        </div>
      </div>

      <div style={{ marginBottom: 15 }}>
        <strong>Worst Performing Stock:</strong>
        <div>
          {data.worstPerformer.symbol} - {data.worstPerformer.name} <br />
          Gain:{" "}
          <span
            style={{
              color: data.worstPerformer.gainPercent >= 0 ? "green" : "red",
            }}
          >
            {data.worstPerformer.gainPercent.toFixed(2)}%
          </span>
        </div>
      </div>

      <div style={{ marginBottom: 15 }}>
        <strong>Diversification Score:</strong> {data.diversificationScore.toFixed(2)}
      </div>

      <div>
        <strong>Risk Level:</strong> {data.riskLevel}
      </div>
    </div>
  );
}
