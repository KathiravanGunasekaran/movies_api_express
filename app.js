const express = require("express"); // returns a function
const fs = require("fs");
const app = express(); // returns and object after calling this function

app.use(express.json()); // adding a middleware to handle post request

// route = http_method + url

const moviesData = JSON.parse(fs.readFileSync("./data/movies.json"));

app.get("/api/v1/movies", (req, res) => {
  res.status(200).json({
    status: "success",
    count: moviesData.length,
    data: {
      movies: moviesData,
    },
  });
});

app.post("/api/v1/movies", (req, res) => {
  const newId = moviesData[moviesData.length - 1].id + 1;
  const updatedNewMovieData = {
    id: newId,
    ...req.body,
  };
  moviesData.push(updatedNewMovieData);
  fs.writeFile("./data/movies.json", JSON.stringify(moviesData), (err) => {
    if (err) {
      res.status(400).json({
        status: "failure",
        message: "failed to create a data",
        error: err,
      });
      return;
    }
    res.status(201).json({
      status: "success",
      data: {
        movie: updatedNewMovieData,
      },
    });
  });
});

app.get("/api/v1/movies/:id", (req, res) => {
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
  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

app.listen(8000,() => {
  console.log("listening to server at port 8000");
});
