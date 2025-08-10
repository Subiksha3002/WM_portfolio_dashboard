import React, { useEffect, useState, useMemo } from "react";

export default function HoldingsTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "symbol", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHoldings = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/list/", {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0ODQwNjAyLCJpYXQiOjE3NTQ4MjI2MDIsImp0aSI6IjdmOGFjY2YxZmJmYTQ1YTdiMTkxMmRkOWMxMzAyM2Q1IiwidXNlcl9pZCI6IjEifQ.-JTopW0XMb7nQscX8mO2ju5zPXHzTw9yFrpN_rsEqmY",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter + Sort logic
  const filteredSortedData = useMemo(() => {
    let filteredData = data;
    if (searchTerm) {
      filteredData = data.filter(
        (item) =>
          item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filteredData = [...filteredData].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === "string") {
          return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
      });
    }
    return filteredData;
  }, [data, searchTerm, sortConfig]);

  if (loading) return <p>Loading holdings...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data.length) return <p>No holdings found.</p>;

  return (
    <div style={{ padding: 20, maxWidth: "100%", overflowX: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Holdings Table</h2>

      <input
        type="text"
        placeholder="Search by symbol or name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: 15,
          padding: "8px 12px",
          width: "100%",
          maxWidth: 400,
          fontSize: 16,
        }}
      />

      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          minWidth: 600,
        }}
      >
        <thead>
          <tr>
            {[
              { label: "Symbol", key: "symbol" },
              { label: "Name", key: "name" },
              { label: "Quantity", key: "quantity" },
              { label: "Avg Price", key: "avg_price" },
              { label: "Current Price", key: "current_price" },
              { label: "Value", key: "value" },
              { label: "Gain/Loss", key: "gain_loss" },
              { label: "Gain/Loss %", key: "gain_loss_percent" },
              { label: "Sector", key: "sector" },
              { label: "Market Cap", key: "market_cap" },
              { label: "Created At", key: "created_at" },
            ].map(({ label, key }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                style={{
                  cursor: "pointer",
                  borderBottom: "2px solid #ddd",
                  padding: "10px 8px",
                  userSelect: "none",
                  textAlign: key === "name" || key === "sector" || key === "market_cap" ? "left" : "right",
                }}
              >
                {label} {sortConfig.key === key ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredSortedData.map((item, idx) => {
            const gainLossPositive = item.gain_loss >= 0;
            return (
              <tr
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white",
                }}
              >
                <td style={{ padding: "8px" }}>{item.symbol}</td>
                <td style={{ padding: "8px" }}>{item.name}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>{item.quantity}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>₹{Number(item.avg_price).toFixed(2)}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>₹{Number(item.current_price).toFixed(2)}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>₹{Number(item.value).toLocaleString()}</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "right",
                    color: gainLossPositive ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  ₹{Number(item.gain_loss).toLocaleString()}
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "right",
                    color: gainLossPositive ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {Number(item.gain_loss_percent).toFixed(2)}%
                </td>
                <td style={{ padding: "8px" }}>{item.sector}</td>
                <td style={{ padding: "8px" }}>{item.market_cap}</td>
                <td style={{ padding: "8px" }}>
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
