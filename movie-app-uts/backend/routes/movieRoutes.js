const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/MovieController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", upload.single("image"), createMovie);
router.put("/:id", upload.single("image"), updateMovie);
router.delete("/:id", deleteMovie);

module.exports = router;