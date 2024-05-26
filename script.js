const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: "c5dc8527ddda463e6b5f3cf287afe0ec",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};
const parts = global.currentPage.split("/"); // Split the pathname into parts
const fileName = parts[parts.length - 1]; // Get the last part, which is the filename

//we want in the nav section if we click movies or tv shows it should hold the color yellow
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-links");
  links.forEach((link) => {
    if (link.getAttribute("href") === `./${fileName}`) {
      link.classList.add("active");
    }
  });
}
//display popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");
  //   console.log(results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="./movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              alt="${movie.title}"
              class="card-img-top"
            />`
                : `<img
                  src="./images/no-image.jpg"
                  alt="${movie.title}"
                  class="card-img-top"
                />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Released on: ${
                movie.release_date
              }</small>
            </p>
          </div>
          `;
    document.querySelector(".popular-movies").appendChild(div);
  });
}
//display popular Tv Shows
async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");
  console.log(results);
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="./tv-details.html?id=${show.id}">
            ${
              show.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              alt="${show.name}"
              class="card-img-top"
            />`
                : `<img
                  src="./images/no-image.jpg"
                  alt="${show.name}"
                  class="card-img-top"
                />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${show.first_air_date}</small>
            </p>
          </div>
          `;
    document.querySelector(".popular-shows").appendChild(div);
  });
}

//display movie-details page
async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];
  const movie = await fetchAPIData(`movie/${movieId}`);

  const div = document.createElement("div");

  div.innerHTML = ` <div class="details-top">
          <div>
            ${
              movie.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
                : `<img
                  src="./images/no-image.jpg"
                  alt="${movie.title}"
                  class="card-img-top"
                />`
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)}/10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p class="text">
            ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit ${
    movie.title
  } Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget :</span>
             $${addCommasToNumber(movie.budget)}
              </li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            }</li>
            <li><span class="text-secondary">Status :</span> ${
              movie.status
            }</li>
          </ul>
          <h4>Production Companies: </h4>
          <div class="list-group">
          ${movie.production_companies
            .map((company) => `<span>${company.name}</span>`)
            .join(", ")}
          </div>
        </div>`;
  document.querySelector("#movie-details").appendChild(div);

  //overlay for background image for movie details
  displayBackgroundImage("movie", movie.backdrop_path);
}
//function to display background image on movie details page
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "110vh";
  overlayDiv.style.width = "100vw";
  // overlayDiv.style.marginTop = "70px";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}
//display Show-details page
async function displayShowDetails() {
  try {
    const showId = window.location.search.split("=")[1];
    const show = await fetchAPIData(`tv/${showId}`);
    console.log(show); // Log the show object to inspect the API response

    const div = document.createElement("div");

    div.innerHTML = `
      <div class="details-top">
        <div>
          ${
            show.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${
                  show.poster_path
                }" class="card-img-top" alt="${show.name || "No Name"}" />`
              : `<img src="./images/no-image.jpg" alt="No Image" class="card-img-top" />`
          }
        </div>
        <div>
          <h2>${show.name || "No Name"}</h2>
          <p>
            <i class="fas fa-star text-primary"></i>
            ${show.vote_average ? show.vote_average.toFixed(1) : "N/A"}/10
          </p>
          <p class="text-muted">Last Air Date: ${
            show.last_air_date || "N/A"
          }</p>
          <p class="text">
            ${show.overview || "No overview available."}
          </p>
          <h5>Genres</h5>
          <ul class="list-group">
            ${
              show.genres
                ? show.genres.map((genre) => `<li>${genre.name}</li>`).join("")
                : "<li>No genres available</li>"
            }
          </ul>
          ${
            show.homepage
              ? `<a href="${show.homepage}" target="_blank" class="btn">Visit ${
                  show.name || "Homepage"
                } Official Homepage</a>`
              : ""
          }
        </div>
      </div>
      <div class="details-bottom">
        <h2>Show Info</h2>
        <ul>
          <li><span class="text-secondary">Total Episodes :</span> ${
            show.number_of_episodes || "N/A"
          }</li>
          <li><span class="text-secondary">Total Seasons :</span> ${
            show.seasons ? show.seasons.length : "N/A"
          }</li>
          <li><span class="text-secondary">Current Season Number :</span> ${
            show.last_episode_to_air
              ? show.last_episode_to_air.season_number
              : "N/A"
          }</li>
          <li><span class="text-secondary">Current Episode Number :</span> ${
            show.last_episode_to_air
              ? show.last_episode_to_air.episode_number
              : "N/A"
          }</li>
          <li><span class="text-secondary">Episode Type :</span> ${
            show.last_episode_to_air
              ? show.last_episode_to_air.episode_type
              : "N/A"
          }</li>
          <li><span class="text-secondary">Episode RunTime :</span> ${
            show.episode_run_time
              ? show.episode_run_time.join(", ") + " mins"
              : "N/A"
          }</li>
          <li><span class="text-secondary">Status :</span> ${
            show.status || "N/A"
          }</li>
          <li><span class="text-secondary">Popularity :</span> ${
            show.popularity
              ? addCommasToNumber(show.popularity).split(".")[0]
              : "N/A"
          }</li>
          <li><span class="text-secondary">Language :</span> ${
            show.origin_country ? show.origin_country[0] : "N/A"
          } - ${
      show.spoken_languages && show.spoken_languages[0]
        ? show.spoken_languages[0].name
        : "N/A"
    }</li>
          <li><span class="text-secondary">Written By :</span> ${
            show.created_by && show.created_by[0]
              ? show.created_by[0].name
              : "N/A"
          }</li>
        </ul>
        <h4>Publishing Networks: </h4>
        <div class="list-group">
          ${
            show.networks
              ? show.networks
                  .map((company) => `<span>${company.name}</span>`)
                  .join(", ")
              : "N/A"
          }
        </div>
      </div>`;
    document.querySelector("#show-details").appendChild(div);

    // Overlay for background image for movie details
    if (show.backdrop_path) {
      displayBackgroundImage("tv", show.backdrop_path);
    }
  } catch (error) {
    console.error("Failed to fetch show details:", error);
  }
}

//show spinner && hide spinner
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//Display Slider Movies using swiper
async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");
  // console.log(results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              ${
                movie.poster_path
                  ? `<img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    alt="${movie.title}"
                  />`
                  : `<img src="./images/no-image.jpg" alt="${movie.title}" />`
              }
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${
                movie.vote_average
              } / 10
            </h4>
            `;
    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 6,
      },
    },
  });
}
//search Movies/Shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term != "" && global.search.term != null) {
    const { results, total_pages, page, total_results } = await searchAPIData();
    // console.log(results);
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No Results Found");
      return;
    }
    displaySearchResults(results); // displaying the results which has found
    //clearing the input
    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please Enter a search term");
  }
}
function displaySearchResults(results) {
  //clear previous results
  document.querySelector(".search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="./${global.search.type}-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
              alt="${
                global.search.type === "movie" ? result.title : result.name
              }"
              class="card-img-top"
            />`
                : `<img
                  src="./images/no-image.jpg"
                  alt="${
                    global.search.type === "movie" ? result.title : result.name
                  }"
                  class="card-img-top"
                />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === "movie" ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Released on: ${
                global.search.type === "movie"
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>
          `;
    document.querySelector(".search-results").appendChild(div);
    document.querySelector(
      "#search-results-heading"
    ).innerHTML = `<h2>${results.length} of ${global.search.totalResults} results for
     ${global.search.term} has found </h2>`;
  });

  displayPagination(); //calling a function which cause pagination in the page
}
//create & display pagination for search
function displayPagination() {
  const div1 = document.createElement("div");
  div1.classList.add("page-counter-container");
  div1.innerHTML = `Page ${global.search.page} of 
                    ${global.search.totalPages}`;

  const div = document.createElement("div");
  div.classList.add("pagination-container");
  div.innerHTML = `<button class="btn btn-primary" id="prev">Prev</button>
                    <button class="btn btn-primary" id="next">Next</button>`;
  document.querySelector("#pagination").appendChild(div1); //here the sequence matter in the page display
  document.querySelector("#pagination").appendChild(div);

  //disable prev button if on first page
  if (global.search.page === 1) {
    document.getElementById("prev").disabled = true;
  }
  //disable next button if on last page
  if (global.search.page == global.search.totalPages) {
    document.getElementById("next").disabled = true;
  }
  //Go to Next Page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
  //Go to Next Page
  if (global.search.page != 1) {
    document.querySelector("#prev").addEventListener("click", async () => {
      global.search.page--;
      const { results, total_pages } = await searchAPIData();
      displaySearchResults(results);
    });
  }
}
// we set the className as error by default so that everytime we dont need to pass-on className in function showAlert
function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 2000);
}
//Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}
//Search API
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showSpinner();
  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}
//Init App  // This is application page router
function init() {
  switch (fileName) {
    case "index.html":
    case "":
      //   console.log("Home");
      displaySlider();
      displayPopularMovies();
      break;
    case "shows.html":
      //   console.log("TV Shows");
      displayPopularShows();
      break;
    case "tv-details.html":
      console.log("Show Details");
      displayShowDetails();
      break;
    case "movie-details.html":
      //   console.log("Movie Details");
      displayMovieDetails();
      break;
    case "search.html":
      // console.log("Search");
      search();
      break;
  }
  highlightActiveLink();
}
document.addEventListener("DOMContentLoaded", init);
