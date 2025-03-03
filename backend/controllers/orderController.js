const orderModel = require("../models/orderModel");
const logger = require("../utils/logger");
const searchHistoryModel = require("../models/searchHistoryModel")
const fs = require("fs");
const { format } = require("fast-csv");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");


const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; 

        const orders = await orderModel.find({ userId })
            .select("-__v") 
            .sort({ createdAt: -1 }); 

        if (!orders.length) {
            return res.status(404).json({ success: false, message: "No orders found." });
        }

        res.status(200).json({ success: true, orders });
    } catch (error) {
        logger.error(`Error fetching orders: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error", error: error.message }); 
    }
};

const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        logger.error(`Error fetching order: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const isValidDate = (date) => !isNaN(Date.parse(date));

const getDailySales = async (req, res) => {
    try {
        const { date } = req.params;

        if (!isValidDate(date)) {
            return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD." });
        }

        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const salesData = await orderModel.aggregate([
            { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
            { $unwind: "$items" },
            { 
                $match: { 
                    "items.quantity": { $gt: 0 }, 
                    "items.price": { $gt: 0 }
                } 
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            }
        ]);

        if (!salesData.length) {
            return res.status(200).json({ success: true, message: "No sales data found for this day.", data: {} });
        }

        res.status(200).json({ success: true, data: salesData[0] });
    } catch (error) {
        console.error("Error fetching daily sales:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const getMonthlySales = async (req, res) => {
    try {
        const { year, month } = req.params;

        if (!/^\d{4}$/.test(year) || !/^(0?[1-9]|1[0-2])$/.test(month)) {
            return res.status(400).json({ success: false, message: "Invalid year or month format. Use YYYY/MM." });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid date range." });
        }

        const salesData = await orderModel.aggregate([
            { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
            { $unwind: "$items" },
            { 
                $match: { 
                    "items.quantity": { $gt: 0 }, 
                    "items.price": { $gt: 0 }
                } 
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            }
        ]);

        if (!salesData.length) {
            return res.status(200).json({ success: true, message: "No sales data found for this month.", data: {} });
        }

        res.status(200).json({ success: true, data: salesData[0] });
    } catch (error) {
        console.error("Error fetching monthly sales:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const getSalesTrends = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const salesTrends = await orderModel.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            { $unwind: "$items" },
            { 
                $match: { 
                    "items.quantity": { $gt: 0 }, 
                    "items.price": { $gt: 0 }
                } 
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    totalSales: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        if (!salesTrends.length) {
            return res.status(404).json({ success: false, message: "No sales trend data found." });
        }

        res.status(200).json({ success: true, data: salesTrends });
    } catch (error) {
        console.error("Error fetching sales trends:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



const getTotalReport = async (req, res) => {
    try {
        const { startDate, endDate, exportFormat } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Start and end dates are required." });
        }

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({ success: false, message: "Invalid date format." });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        
        const topSearchedProducts = await searchHistoryModel.aggregate([
            { $match: { searchedAt: { $gte: start, $lt: end } } },
            { $group: { _id: "$searchTerm", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        console.log(topSearchedProducts)

        
        const totalReport = await orderModel.aggregate([
            { $match: { createdAt: { $gte: start, $lt: end } } },
            { $unwind: "$items" },
            {
                $match: { 
                    "items.quantity": { $gt: 0 }, 
                    "items.price": { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: "$items.productId",
                    productName: { $first: "$items.name" },
                    totalSales: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            { $sort: { totalSales: -1 } }
        ]);

        

        //  Handle Export Formats (CSV, Excel, PDF)


        if (exportFormat) {
            const fileName = `exports/sales_report.${exportFormat}`;
            
            if (exportFormat === "csv") {
                const csvStream = format({ headers: true });
                const writableStream = fs.createWriteStream(fileName);
                csvStream.pipe(writableStream);
                totalReport.forEach((item) => csvStream.write(item));
                csvStream.end();

                writableStream.on("finish", () => res.download(fileName));
                return;
            }

            if (exportFormat === "xlsx") {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet("Sales Report");

                worksheet.columns = [
                    { header: "Product ID", key: "_id", width: 20 },
                    { header: "Product Name", key: "productName", width: 25 },
                    { header: "Total Sales", key: "totalSales", width: 15 },
                    { header: "Total Revenue", key: "totalRevenue", width: 20 }
                ];

                totalReport.forEach((item) => worksheet.addRow(item));

                await workbook.xlsx.writeFile(fileName);
                return res.download(fileName);
            }

            if (exportFormat === "pdf") {
                const doc = new PDFDocument();
                doc.pipe(fs.createWriteStream(fileName));

                doc.fontSize(18).text("Sales Report", { align: "center" }).moveDown(2);
                doc.fontSize(12).text("Product ID", 50, 100);
                doc.text("Product Name", 150, 100);
                doc.text("Total Sales", 300, 100);
                doc.text("Total Revenue", 400, 100);
                doc.moveDown();

                let y = 120;
                totalReport.forEach((item) => {
                    doc.text(item._id, 50, y);
                    doc.text(item.productName, 150, y);
                    doc.text(item.totalSales.toString(), 300, y);
                    doc.text(`$${item.totalRevenue}`, 400, y);
                    y += 20;
                });

                doc.end();
                return res.download(fileName);
            }

            return res.status(400).json({ success: false, message: "Invalid export format" });
        }

        // ✅ Send JSON response (when no export)
        res.status(200).json({
            success: true,
            totalRevenue,
            topSellingProducts: totalReport,
            topSearchedProducts
        });

    } catch (error) {
        console.error("Error fetching total report:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const getTotallReport = async (req, res) => {
    try {
        const { startDate, endDate, exportFormat, type } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Start and end dates are required." });
        }

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return res.status(400).json({ success: false, message: "Invalid date format." });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        let groupByFormat;
        if (type === "daily") {
            groupByFormat = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
                productId: "$items.productId",
                productName: "$items.name"
            };
        } else if (type === "weekly") {
            groupByFormat = {
                year: { $year: "$createdAt" },
                weekOfYear: { $isoWeek: "$createdAt" },
                productId: "$items.productId",
                productName: "$items.name"
            };
        } else if (type === "monthly") {
            groupByFormat = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                productId: "$items.productId",
                productName: "$items.name"
            };
        } else {
            return res.status(400).json({ success: false, message: "Invalid report type" });
        }

        const totalReport = await orderModel.aggregate([
            { $match: { createdAt: { $gte: start, $lt: end } } },
            { $unwind: "$items" },
            {
                $match: {
                    "items.quantity": { $gt: 0 },
                    "items.price": { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: groupByFormat,
                    productName: { $first: "$items.name" },
                    totalSales: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        const totalRevenue = totalReport.reduce((sum, item) => sum + item.totalRevenue, 0);

        // Handle export formats (CSV, Excel, PDF)
        if (exportFormat) {
            const fileName = `exports/sales_report.${exportFormat}`;

            if (exportFormat === "csv") {
                const csvStream = format({ headers: true });
                const writableStream = fs.createWriteStream(fileName);
                csvStream.pipe(writableStream);
              
                
                totalReport.forEach((item) => {
                  
                  const formattedItem = {
                    date: new Date(item.date).toLocaleDateString(), 
                    productName: item.productName,
                    totalSales: item.totalSales,
                    totalRevenue: item.totalRevenue
                  };
                  
                  csvStream.write(formattedItem); 
                });
              
                csvStream.end();
              
                writableStream.on("finish", () => res.download(fileName));
                return;
              }

            if (exportFormat === "xlsx") {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet("Sales Report");

                worksheet.columns = [
                    { header: "Year", key: "year", width: 15 },
                    { header: "Month", key: "month", width: 10 },
                    { header: "Day/Week", key: "dayOrWeek", width: 15 },
                    { header: "Product Name", key: "productName", width: 25 },
                    { header: "Total Sales", key: "totalSales", width: 15 },
                    { header: "Total Revenue", key: "totalRevenue", width: 20 }
                ];

                totalReport.forEach((item) => {
                    const dayOrWeek = type === "daily" ? item._id.day : (type === "weekly" ? item._id.weekOfYear : item._id.month);
                    worksheet.addRow({
                        year: item._id.year,
                        month: item._id.month,
                        dayOrWeek: dayOrWeek,
                        productName: item.productName,
                        totalSales: item.totalSales,
                        totalRevenue: item.totalRevenue
                    });
                });

                await workbook.xlsx.writeFile(fileName);
                return res.download(fileName);
            }

            if (exportFormat === "pdf") {
                const doc = new PDFDocument();
                doc.pipe(fs.createWriteStream(fileName));

                doc.fontSize(18).text("Sales Report", { align: "center" }).moveDown(2);
                doc.fontSize(12).text("Year", 50, 100);
                doc.text("Month", 100, 100);
                doc.text("Day/Week", 150, 100);
                doc.text("Product Name", 250, 100);
                doc.text("Total Sales", 350, 100);
                doc.text("Total Revenue", 450, 100);
                doc.moveDown();

                let y = 120;
                totalReport.forEach((item) => {
                    const dayOrWeek = type === "daily" ? item._id.day : (type === "weekly" ? item._id.weekOfYear : item._id.month);
                    doc.text(item._id.year, 50, y);
                    doc.text(item._id.month, 100, y);
                    doc.text(dayOrWeek, 150, y);
                    doc.text(item.productName, 250, y);
                    doc.text(item.totalSales.toString(), 350, y);
                    doc.text(`$${item.totalRevenue}`, 450, y);
                    y += 20;
                });

                doc.end();
                return res.download(fileName);
            }

            return res.status(400).json({ success: false, message: "Invalid export format" });
        }

        res.status(200).json({
            success: true,
            totalRevenue,
            totalReport,
        });
        console.log(totalReport)
    } catch (error) {
        console.error("Error fetching total report:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};





module.exports = { getUserOrders, getOrderById,  getDailySales, getMonthlySales, getSalesTrends, getTotalReport, getTotallReport };
