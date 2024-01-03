import React, { useEffect, useState } from "react";
import axios from "../axios";
import Youtube from "react-youtube";
import "./Row.css";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(fetchUrl);
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = async (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      try {
        const youtubeResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              key: YOUTUBE_API_KEY,
              part: "snippet",
              q: `${movie.name} trailer`,
              type: "video",
              maxResults: 1,
            },
          }
        );
        const videoId = youtubeResponse.data.items[0]?.id?.videoId || "";
        setTrailerUrl(videoId);
      } catch (error) {
        console.log("Error fetching video >>>>", error);
      }
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posts">
        {movies.map(
          (movie) =>
            movie.poster_path && (
              <img
                key={movie.id}
                onClick={() => handleClick(movie)}
                className={`row__posters ${isLargeRow && "row__postersLarge"}`}
                src={`${base_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
              />
            )
        )}
      </div>

      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
