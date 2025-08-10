import React, { useEffect, useState } from "react";

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
  margin: "15px",
  width: "250px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "20px",
  marginTop: "30px",
};

export default function PortfolioOverview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolioSummary = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/list/", {
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
    fetchPortfolioSummary();
  }, []);

  if (loading) return <div>Loading portfolio data...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalValue = data.reduce((sum, p) => sum + Number(p.value), 0);
  const totalInvested = data.reduce(
    (sum, p) => sum + Number(p.avg_price) * p.quantity,
    0
  );
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent =
    totalInvested === 0 ? 0 : ((totalGainLoss / totalInvested) * 100).toFixed(2);
  const numberOfHoldings = data.length;

  return (
    <>
      <h2 style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        Portfolio Overview
      </h2>
      <div style={containerStyle}>
        {/* Total Portfolio Value */}
        <div style={cardStyle}>
          <div style={{ fontSize: "40px" }}>💰</div>
          <h3>Total Portfolio Value</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            ₹{totalValue.toFixed(2)}
          </p>
        </div>

        {/* Total Gain/Loss */}
        <div style={cardStyle}>
          <div style={{ fontSize: "40px" }}>
            {totalGainLoss >= 0 ? "📈" : "📉"}
          </div>
          <h3>Total Gain/Loss</h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: totalGainLoss >= 0 ? "green" : "red",
            }}
          >
            ₹{totalGainLoss.toFixed(2)} ({totalGainLossPercent}%)
          </p>
        </div>

        {/* Portfolio Performance % */}
        <div style={cardStyle}>
          <div style={{ fontSize: "40px" }}>📊</div>
          <h3>Portfolio Performance %</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {totalGainLossPercent}%
          </p>
        </div>

        {/* Number of Holdings */}
        <div style={cardStyle}>
          <div style={{ fontSize: "40px" }}>📂</div>
          <h3>Number of Holdings</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {numberOfHoldings}
          </p>
        </div>
      </div>
    </>
  );
}
