const express = require("express");
const cors = require("cors");
const path = require("path");

const movieRoutes = require("./routes/movieRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/movies", movieRoutes);

app.get("/", (req, res) => {
  res.send("Movie API is running...");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});