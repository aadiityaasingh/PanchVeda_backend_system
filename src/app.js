const express = require("express");
const cors = require("cors");
const app = express();
const patientRoutes = require("./routes/patient.route.js");
const therapyRoutes = require("./routes/therapy.route.js");
const therapyPlanRoutes = require("./routes/therapyPlan.route.js");
const sessionRoutes = require("./routes/session.route.js");
const userRoutes = require("./routes/user.route.js");
const authRoutes = require("./routes/auth.route.js");
const billRoutes = require("./routes/bill.route.js");
const reportRoutes = require("./routes/report.route.js");
const errorHandler = require("./middlewares/errorHandler.js");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.js");

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true,
  credentials: true
}));

app.get("/", (req, res) => {
  res.json({
    message: "Panchveda Management API is running",
    documentation: "https://panchakarma-backend-system.onrender.com/api-docs"
  });
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/patients", patientRoutes);
app.use("/api/therapies", therapyRoutes);
app.use("/api/therapy-plans", therapyPlanRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

module.exports = app;
