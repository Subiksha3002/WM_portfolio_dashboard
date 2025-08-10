import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AssetAllocation from "./components/AssetAllocation";
import PortfolioOverview from "./components/PortfolioOverview";
import PerformanceComparison from "./components/performancecomparison";
import PerformanceInsights from "./components/PerformanceInsights";
import HoldingsTable from "./components/HoldingsTable";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to portfolio-overview */}
        <Route path="/" element={<Navigate to="/portfolio-overview" replace />} />
        <Route path="/" element={<Navigate to="/portfolio-allocation" replace />} />
        <Route path="/" element={<Navigate to="/portfolio-performance" replace />} />
        <Route path="/" element={<Navigate to="/portfolio-summary" replace />} />
        <Route path="/" element={<Navigate to="/portfolio-holdings" replace />} />

        {/* Portfolio Overview Route */}
        <Route path="/portfolio-overview" element={<PortfolioOverview />} />
        {/* Asset Allocation Route */}
        <Route path="/asset-allocation" element={<AssetAllocation />} />
        {/* Performance Comparison Route */}
        <Route path="/performance-comparison" element={<PerformanceComparison />} />
        {/* Top Performers Route */}
        <Route path="/performance-insights" element={<PerformanceInsights />} />
        {/* Holdings Table Route */}
        <Route path="/holdings-table" element={<HoldingsTable />} />
        

        {/* You can add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
