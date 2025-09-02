const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("D:/question bank/backend/db");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const questionRoutes = require("./backend/routes/question");
app.use("/api/questions", questionRoutes);

// اتصال به دیتابیس
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
