import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

const SalesReport = () => {
  const [dailySales, setDailySales] = useState(null);
  const [monthlySales, setMonthlySales] = useState(null);
  const [salesTrends, setSalesTrends] = useState([]);
  const [totalReport, setTotalReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  const navigate = useNavigate(); 

  // Fetch sales data on component mount
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date().toISOString().split("T")[0];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        // Fetch daily sales data
        const dailyRes = await axios.get(`http://localhost:4000/api/order/sales/daily/${today}`, { withCredentials: true });
        if (dailyRes.data.message) {
          setDailySales(null); 
        } else {
          setDailySales(dailyRes.data.data);
        }

        // Fetch monthly sales data
        const monthlyRes = await axios.get(`http://localhost:4000/api/order/sales/monthly/${currentYear}/${currentMonth}`, { withCredentials: true });
        setMonthlySales(monthlyRes.data.data);

        // Fetch sales trends data
        const trendsRes = await axios.get("http://localhost:4000/api/order/sales/trends", { withCredentials: true });
        setSalesTrends(trendsRes.data.data.map(trend => ({
          month: `${trend._id.year}-${trend._id.month}`,
          Sales: trend.totalSales,
          Revenue: trend.totalRevenue
        })));

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch sales data.");
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // Fetch total report based on selected date range
  const fetchTotalReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const totalReportRes = await axios.get(`http://localhost:4000/api/order/sales/total-report?startDate=${startDate}&endDate=${endDate}`, { withCredentials: true });
      setTotalReport(totalReportRes.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch total report.");
      setLoading(false);
    }
  };

  // Handle exporting the report
  const handleExport = async () => {
    if (!startDate || !endDate || !exportFormat) {
      setError("Please select a date range and format!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:4000/api/order/sales/total-report?startDate=${startDate}&endDate=${endDate}&exportFormat=${exportFormat}`,
        { responseType: "blob", withCredentials: true }
      );

      // Create a downloadable file link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `sales_report.${exportFormat}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setLoading(false);
    } catch (err) {
      setError("Failed to export report.");
      setLoading(false);
    }
  };

  return (
    <div className="p-9 pl-15 w-full">
      <h2 className="text-2xl font-bold mb-4">Sales Report</h2>
      {loading && <p>Loading sales data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Daily Sales Section */}
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">Daily Sales</h3>
            {dailySales ? (
              <>
                <p>Total Sales: {dailySales.totalSales}</p>
                <p>Revenue: ${dailySales.totalRevenue}</p>
              </>
            ) : (
              <p>No sales data available for today.</p>
            )}
          </div>

          {/* Monthly Sales Section */}
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">Monthly Sales</h3>
            {monthlySales ? (
              <>
                <p>Total Sales: {monthlySales.totalSales}</p>
                <p>Revenue: ${monthlySales.totalRevenue}</p>
              </>
            ) : (
              <p>No sales data available for this month.</p>
            )}
          </div>

          {/* Sales Trends Section */}
          <div className="bg-white p-4 shadow-md rounded-lg w-full">
            <h3 className="text-lg font-semibold">Sales Trends (Last 6 Months)</h3>
            {salesTrends.length > 0 ? (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesTrends}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Sales" fill="#8884d8" />
                    <Bar dataKey="Revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p>No trends data available.</p>
            )}
          </div>

          {/* Total Report Section */}
          <div className="bg-white p-4 shadow-md rounded-lg w-full">
            <h3 className="text-lg font-semibold">Total Report</h3>
            <div className="flex gap-4 mb-4">
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
              <button
                onClick={fetchTotalReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-md self-end"
              >
                Fetch Report
              </button>
            </div>

            {totalReport ? (
              <>
                <h4 className="mt-2 font-semibold">Top 5 Selling Products:</h4>
                <PieChart width={400} height={500}>
                  <Pie
                    data={totalReport.topSellingProducts.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="totalSales"
                    nameKey="productName"
                    label
                  >
                    {totalReport.topSellingProducts.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </>
            ) : (
              <p>No data available for the selected range.</p>
            )}
          </div>

          {/* Styled "Get Total Report" Button */}
          <button
            onClick={() => navigate("/total-report")} // Navigate to /total-report on click
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Get Total Report
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
