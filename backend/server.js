const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Jenkins CI/CD Assessment Backend is running"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "backend"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on port ${PORT}`);
});
