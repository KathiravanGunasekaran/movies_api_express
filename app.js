const express = require("express"); // returns a function
const fs = require("fs");
const app = express(); // returns and object after calling this function
app.use(express.json()); // adding a middleware to handle post request

// route = http_method + url

/**
 * Updating the data has two method in rest API
 *
 * PUT:
 *   PUT is a method of modifying resource where the client
 *   sends the data updates the entire resource
 *
 * PATCH:
 *   PATCH is a method of modifying resource where the client sends
 *   partial data that is to be updated without modifying the entire data
 */

const moviesData = JSON.parse(fs.readFileSync("./data/movies.json"));

const getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
    count: moviesData.length,
    data: {
      movies: moviesData,
    },
  });
};

const createMovie = (req, res) => {
  const newId = moviesData[moviesData.length - 1].id + 1;
  const updatedNewMovieData = {
    id: newId,
    ...req.body,
  };
  moviesData.push(updatedNewMovieData);
  fs.writeFile("./data/movies.json", JSON.stringify(moviesData), (err) => {
    if (err) {
      return res.status(400).json({
        status: "failure",
        message: "failed to create a data",
        error: err,
      });
    }
    res.status(201).json({
      status: "success",
      data: {
        movie: updatedNewMovieData,
      },
    });
  });
};

const getMovie = (req, res) => {
  const requiredID = Number(req.params.id);
  /*
  moviesData.forEach((item) => {
    if (item.id === requiredID) {
      res.status(200).json({
        status: "success",
        data: {
          movie: item,
        },
      });
    }
  });
  */
  let movie = moviesData.find((item) => item.id === requiredID);
  if (movie) {
    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } else {
    res.status(404).json({
      status: "failure",
      message: "Requested data not found",
    });
  }
};

const updateMovie = (req, res) => {
  const id = Number(req.params.id);
  const movieToUpdate = moviesData.find((item) => item.id === id);
  if (movieToUpdate) {
    let index = moviesData.indexOf(movieToUpdate);
    Object.assign(movieToUpdate, req.body);
    moviesData[index] = movieToUpdate;
    fs.writeFile("./data/movies.json", JSON.stringify(moviesData), (err) => {
      if (err) {
        return res.status(400).json({
          status: "failure",
          message: "failed to update data",
          error: err,
        });
      }
      res.status(200).json({
        status: "success",
        data: {
          movie: movieToUpdate,
        },
      });
    });
  } else {
    res.status(404).json({
      status: "failure",
      message: "Requested data not found",
    });
  }
};

const deleteMovie = async (req, res) => {
  const id = Number(req.params.id);
  const movieToBeDeleted = moviesData.find((item) => item.id === id);
  if (movieToBeDeleted) {
    const index = moviesData.indexOf(movieToBeDeleted);
    moviesData.splice(index, 1);
    fs.writeFile("./data/movies.json", JSON.stringify(moviesData), (err) => {
      if (err) {
        return res.status(400).json({
          status: "failure",
          message: "failed to update data",
          error: err,
        });
      }
      res.status(204).json({
        status: "success",
        data: {
          movie: null,
        },
      });
    });
  } else {
    res.status(404).json({
      status: "failure",
      message: "Requested data for deletion not found",
    });
  }
};

/*
app.get("/api/v1/movies", getAllMovies);
app.post("/api/v1/movies", createMovie);
app.get("/api/v1/movies/:id", getMovie);
app.patch("/api/v1/movies/:id", updateMovie);
app.delete("/api/v1/movies/:id", deleteMovie);
*/

/**
 * since the routes for respective methods are same 
 * it's a best practice to handle the requests like below rather than above
 */

app.route("/api/v1/movies").get(getAllMovies).post(createMovie);
app.route("/api/v1/movies/:id").get(getMovie).patch(updateMovie).delete(deleteMovie);

app.listen(8000, "127.0.0.1", () => {
  console.log("listening to server at port 8000");
});
