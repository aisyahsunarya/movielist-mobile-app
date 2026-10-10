const prisma = require("../utils/prisma");
const fs = require("fs");
const path = require("path");

// GET ALL MOVIES
exports.getMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "List Data Movies",
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET MOVIE BY ID
exports.getMovieById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const movie = await prisma.movie.findUnique({
      where: {
        id: id,
      },
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Detail Movie",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE MOVIE
exports.createMovie = async (req, res) => {
  try {
    const { title, genre, releaseYear, rating, description } = req.body;

    const movie = await prisma.movie.create({
      data: {
        title,
        genre,
        releaseYear: parseInt(releaseYear),
        rating: rating ? parseFloat(rating) : null,
        description,
        image: req.file ? req.file.filename : null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE MOVIE
exports.updateMovie = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, genre, releaseYear, rating, description } = req.body;

    const oldMovie = await prisma.movie.findUnique({
      where: {
        id: id,
      },
    });

    if (!oldMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    let imageName = oldMovie.image;

    if (req.file) {
      if (oldMovie.image) {
        const oldImagePath = path.join(
          __dirname,
          "../uploads",
          oldMovie.image
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      imageName = req.file.filename;
    }

    const movie = await prisma.movie.update({
      where: {
        id: id,
      },
      data: {
        title,
        genre,
        releaseYear: parseInt(releaseYear),
        rating: rating ? parseFloat(rating) : null,
        description,
        image: imageName,
      },
    });

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE MOVIE
exports.deleteMovie = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const movie = await prisma.movie.findUnique({
      where: {
        id: id,
      },
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    if (movie.image) {
      const imagePath = path.join(__dirname, "../uploads", movie.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.movie.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};