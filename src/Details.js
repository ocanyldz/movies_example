import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';

const Details = (props) => {
  const id = props.match.params.id;
  const [movieDetails, setMovieDetails] = useState([]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const res = await axios.get(
        "http://www.omdbapi.com/?apikey=a7f0a0ef&type=movie&i=" + id
      );
      if (res.statusText === "OK") {
        setMovieDetails(res.data);
        setRating(parseFloat(res.data.imdbRating));
      } else {
        setMovieDetails([]);
      }
    };

    fetchMovieDetails();
  }, []);

  return (
    <div className="detailsWrapper">
      <div className="detailsContainer">
        <div className="detailImg">
          <img alt={movieDetails.Title} src={movieDetails.Poster}></img>
        </div>
        <div className="detailInfo">
          <div className="mainTitle">
            {movieDetails.Title}
            <hr />
          </div>
          <div>
            <div className="title">Genre : </div>
            <div>{movieDetails.Genre}</div>
          </div>
          <div>
            <div className="title">Director : </div>
            <div>{movieDetails.Director}</div>
          </div>
          <div>
            <div className="title">Actors : </div>
            <div>{movieDetails.Actors}</div>
          </div>
          <div>
            <div className="title">Runtime : </div>
            <div>{movieDetails.Runtime}</div>
          </div>
          <div className="rating">
            <Typography component="legend">IMDB Rating ({rating})</Typography>
            <Rating
              name="half-rating-read"
              value={rating}
              max={10}
              precision={0.5}
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="homeLink">
        <Link to="/"><Button variant="contained">Back To Home Page</Button></Link>
      </div>
    </div>
  );
};

export default Details;