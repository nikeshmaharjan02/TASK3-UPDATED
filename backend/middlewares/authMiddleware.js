// User authentication middleware
const authUser = (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ success: false, message: "Not authorized. Please login." });
        }

        // Attach user info from session
        req.user = req.session.user;

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Admin authorization middleware (RBAC)
const authAdmin = (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied. Admins only." });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { authUser, authAdmin };









// const jwt = require('jsonwebtoken');

// // user authentication middleware
// const authUser = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
//         if (!token) {
//             return res.json({ success: false, message: "Not authorized. Login again." });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Attach user ID and role to request
//         req.user = { id: decoded.id, role: decoded.role };

//         next();

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };
// // Admin authorization middleware (RBAC)
// const authAdmin = async (req, res, next) => {
//     try {
//         if (!req.user || req.user.role !== "admin") {
//             return res.status(403).json({ success: false, message: "Access denied. Admins only." });
//         }

//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };

// module.exports = { authUser, authAdmin };
