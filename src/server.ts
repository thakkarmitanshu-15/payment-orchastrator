import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import "./config/redis";
import "./workers/paymentRetryWorker";
import "./jobs/startReconciliation";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});