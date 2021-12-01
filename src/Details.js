import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import dexieFunctions from "./dexieFunctions";

const Details = (props) => {
  const id = props.match.params.id;
  const [movieDetails, setMovieDetails] = useState([]);
  const [rating, setRating] = useState(0);
  const [imageSource, setImageSource] = useState(null);

  const imageRef = useRef(null);

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  useLayoutEffect(() => {
    imageRef.current.addEventListener("load", imageLoaded);
  }, []);

  const fetchMovieDetails = async () => {
    let detailUrl = "http://www.omdbapi.com/?apikey=a7f0a0ef&type=movie&i=" + id;
    const details = await axios.get(
      detailUrl
    );
    if (details.statusText === "OK") {
      setMovieDetails(details.data);

      dexieFunctions.getImageFromDb(details.data.Poster).then(res => {
        if(res.length > 0){
          setImageSource(res[0].base64_url);
          return;
        }else{
          setImageSource(details.data.Poster);
        }
      });
      
      setRating(parseFloat(details.data.imdbRating));
    } else {
      setMovieDetails([]);
    }
  };

  const imageLoaded = async() => {
    if(imageRef.current && !imageRef.current.currentSrc.includes("data:image")){
        let dataUrl = imageToBase64Url(imageRef.current);
        if(dataUrl !== "data:,")
        dexieFunctions.addImageToDb(imageRef.current.src, dataUrl);
    }
  }

  const imageToBase64Url = (currentRef) => {
    currentRef.crossOrigin = "anonymous";
    var imgCanvas = document.createElement("canvas"),
    imgContext = imgCanvas.getContext("2d");
  
    imgCanvas.width = currentRef.naturalWidth;
    imgCanvas.height = currentRef.naturalHeight;
  
    imgContext.drawImage(currentRef, 0, 0);
  
    var imgAsDataURL = imgCanvas.toDataURL("image/jpeg", 0.7);
  
    return imgAsDataURL;
  }

  return (
    <div className="detailsWrapper">
      <div className="detailsContainer">
        <div className="detailImg">
          <img alt={movieDetails.Title} src={imageSource} ref={imageRef}></img>
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