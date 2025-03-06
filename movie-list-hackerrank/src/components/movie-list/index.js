import React, { useState } from "react";
import "./index.css";
import { defineCustomElements } from "h8k-components/loader";

function MovieList() {
  const [movies, setMovies] = useState([]); // Ensure it's an array
  const [movieYear, setMovieYear] = useState(""); // Start as empty string
  const [hasSearched, setHasSearched] = useState(false); // Track search status

  const handleChange = (event) => {
    setMovieYear(event.target.value);
  };

  const handleClick = async () => {
    await fetchMovies();
  };

  const fetchMovies = async () => {
    if (!movieYear) return; // Prevent empty search

    setHasSearched(true); // Mark that a search was made

    try {
      const response = await fetch(
        `https://jsonmock.hackerrank.com/api/movies?Year=${movieYear}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const movieList = await response.json();
      setMovies(movieList.data); // Ensure data is stored correctly
    } catch (error) {
      console.error("Fetch error:", error);
      setMovies([]); // Reset movies in case of an error
    }
  };

  return (
    <div className="layout-column align-items-center mt-50">
      <section className="layout-row align-items-center justify-content-center">
        <input
          type="number"
          className="large"
          placeholder="Enter Year eg 2015"
          value={movieYear}
          onChange={handleChange}
          data-testid="app-input"
        />
        <button className="" data-testid="submit-button" onClick={handleClick}>
          Search
        </button>
      </section>

      {/* Show movie list if movies exist */}
      {movies.length > 0 ? (
        <ul className="mt-50 styled" data-testid="movieList">
          {movies.map((movie, index) => (
            <li key={index} className="slide-up-fade-in py-10">{movie.Title}</li>
          ))}
        </ul>
      ) : (
        // Only show "No Results Found" if the user has searched
        hasSearched && (
          <div className="mt-50 slide-up-fade-in" data-testid="no-result">
            No Results Found
          </div>
        )
      )}
    </div>
  );
}

defineCustomElements();
export default MovieList;
