import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"; // Import Recharts

const TotalReport = () => {
  const [totalReport, setTotalReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("daily"); 
  const [exportFormat, setExportFormat] = useState(""); 
  const navigate = useNavigate();

  // Fetch total report based on selected date range and type
  const fetchTotalReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const totalReportRes = await axios.get(
        `http://localhost:4000/api/order/sales/totall-report?startDate=${startDate}&endDate=${endDate}&type=${reportType}&exportFormat=${exportFormat}`,
        { withCredentials: true }
      );

      setTotalReport(totalReportRes.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch total report.");
      setLoading(false);
    }
  };

  // Handle report export (CSV, Excel, or PDF)
  const handleExport = async (format) => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const exportRes = await axios.get(
        `http://localhost:4000/api/order/sales/totall-report?startDate=${startDate}&endDate=${endDate}&type=${reportType}&exportFormat=${format}`,
        { responseType: "blob", withCredentials: true }
      );

      const url = window.URL.createObjectURL(new Blob([exportRes.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `sales_report.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setLoading(false);
    } catch (err) {
      setError("Failed to export report.");
      setLoading(false);
    }
  };

  // Format data for chart
  const chartData =
    totalReport?.totalReport?.map((item) => {
      let formattedDate = "";

      if (reportType === "daily") {
        formattedDate = `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`;
      } else if (reportType === "weekly") {
        formattedDate = `Week ${item._id.weekOfYear}, ${item._id.year}`;
      } else if (reportType === "monthly") {
        formattedDate = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      }

      return {
        date: formattedDate,
        sales: item.totalSales,
        revenue: item.totalRevenue,
        productName: item.productName
      };
    }) || [];

  return (
    <div className="p-9 pl-15 w-full">
      <h2 className="text-2xl font-bold mb-4">Total Sales Report</h2>
      {loading && <p>Loading total report data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="w-full space-y-10">
          {/* Report Type and Date Range Selection */}
          <div className="bg-white p-4 shadow-md rounded-lg max-w-2xl">
            <h3 className="text-lg font-semibold">Select Report Type and Date Range</h3>
            <div className="flex flex-col gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border p-2 rounded-md w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border p-2 rounded-md w-full"
                  required
                />
              </div>
            </div>

            {/* Report Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Report Type:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border p-2 rounded-md w-full"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Fetch Report Button */}
            <button
              onClick={fetchTotalReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
            >
              Fetch Report
            </button>
          </div>

          {/* Display Report Data */}
          <div className="bg-white p-4 shadow-md rounded-lg w-full">
            {totalReport ? (
              <>
                <h4 className="mt-2 font-semibold">Total Revenue: ${totalReport.totalRevenue}</h4>
                <h5 className="mt-4 text-lg font-semibold">Report Data</h5>

                {/* Graph Container */}
                {totalReport.length > 25 ? (
                <p>Too Large to show</p>
                ):(
                    <div className="w-full h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" name="Total Sales" />
                      <Bar dataKey="revenue" fill="#82ca9d" name="Total Revenue" />
                      <Bar dataKey="productName" fill="#9b59b6" name="Product Name" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                )}

                {/* Data Table */}
                <table className="min-w-full mt-4 table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">Total Sales</th>
                      <th className="px-4 py-2 text-left">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{item.date}</td>
                        <td className="px-4 py-2">{item.productName}</td>
                        <td className="px-4 py-2">{item.sales}</td>
                        <td className="px-4 py-2">${item.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p>No data available for the selected range.</p>
            )}
          </div>
        </div>
      )}
      <div className="mt-5">
            <button onClick={() => handleExport("csv")} className="bg-green-500 text-white px-4 py-2 rounded-md mx-2">Export CSV</button>
            <button onClick={() => handleExport("xlsx")} className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2">Export Excel</button>
            <button onClick={() => handleExport("pdf")} className="bg-red-500 text-white px-4 py-2 rounded-md mx-2">Export PDF</button>
          </div>
    </div>
  );
};

export default TotalReport;
