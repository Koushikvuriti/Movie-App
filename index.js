const parentElement = document.querySelector(".main");
const searchElement = document.querySelector(".input");
const movieRatings = document.querySelector("#rating-select");
const movieGenres = document.querySelector("#genre-select");

let searchValue = "";
let ratings = 0;
let genreVal = "";
let filteredArrayOfMovies = [];

const URL = "https://moviesapp-560c2-default-rtdb.firebaseio.com/.json";

const getMovies = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (err) {}
};

let movies = await getMovies(URL);
 console.log(movies);

const createElement = (element) =>document.createElement(element);

/** Movie Cards */

const createMovieCard = (movies) => {
    for (let movie of movies) {
      // creating parent container
      const cardContainer = createElement("div");
      cardContainer.classList.add("card", "shadow");
  
      // creating image container
      const imageContainer = createElement("div");
      imageContainer.classList.add("card-image-container");
  
      // creating card image
      const imageEle = createElement("img");
      imageEle.classList.add("card-image");
      imageEle.setAttribute("src", movie.Poster_Link);
      imageEle.setAttribute("alt", movie.Series_Title);
      imageContainer.appendChild(imageEle);
  
      cardContainer.appendChild(imageContainer);
  
      // creating card details container
  
      const cardDetails = createElement("div");
      cardDetails.classList.add("movie-details");
  
      // card title
  
      const titleEle = createElement("p");
      titleEle.classList.add("title");
      titleEle.innerText = movie.Series_Title;
      cardDetails.appendChild(titleEle);
  
      // card genre
  
      const genreEle = createElement("p");
      genreEle.classList.add("genre");
      genreEle.innerText = `Genre: ${movie.Genre}`;
      cardDetails.appendChild(genreEle);
  
      // ratings and length container
      const movieRating = createElement("div");
      movieRating.classList.add("ratings");
  
      // star/rating component
  
      const ratings = createElement("div");
      ratings.classList.add("star-rating");
  
      // star icon
      const starIcon = createElement("span");
      starIcon.classList.add("material-icons-outlined");
      starIcon.innerText = "star";
      ratings.appendChild(starIcon);
  
      // ratings
      const ratingValue = createElement("span");
      ratingValue.innerText = movie.IMDB_Rating;
      ratings.appendChild(ratingValue);
  
      movieRating.appendChild(ratings);
  
      // length
      const length = createElement("p");
      length.innerText = `${movie.Runtime} mins`;
  
      movieRating.appendChild(length);
      cardDetails.appendChild(movieRating);
      cardContainer.appendChild(cardDetails);
  
      parentElement.appendChild(cardContainer);
    }
  };

function getFilteredData(){
  filteredArrayOfMovies = searchValue?.length>0 ? movies.filter(
    (movie) => 
      searchValue === movie.Series_Title.toLowerCase() ||
    searchValue === movie.Director.toLowerCase() ||
    searchValue === movie.Star1.toLowerCase() ||
    searchValue === movie.Star2.toLowerCase() ||
    searchValue === movie.Star3.toLowerCase() ||
    searchValue === movie.Star4.toLowerCase()
  ) : movies;
  if(ratings > 0){
    filteredArrayOfMovies = searchValue?.length > 0 ? filteredArrayOfMovies : movies;
    filteredArrayOfMovies = filteredArrayOfMovies.filter((movie) => movie.IMDB_Rating >= ratings);
  }
  if(genreVal?.length > 0){
    filteredArrayOfMovies = searchValue?.length > 0 || ratings > 7 ? filteredArrayOfMovies : movies;
    filteredArrayOfMovies = filteredArrayOfMovies.filter((movie) => movie.Genre.includes(genreVal));
  }
  return filteredArrayOfMovies;
}

function handleSearch(event){
  searchValue = event.target.value.toLowerCase();
  console.log(searchValue);
  filteredArrayOfMovies = searchValue?.length>0 ? movies.filter(
    (movie) => 
      searchValue === movie.Series_Title.toLowerCase() ||
    searchValue === movie.Director.toLowerCase() ||
    searchValue === movie.Star1.toLowerCase() ||
    searchValue === movie.Star2.toLowerCase() ||
    searchValue === movie.Star3.toLowerCase() ||
    searchValue === movie.Star4.toLowerCase()
  ) : movies;
  parentElement.innerHTML = "";
  createMovieCard(filteredArrayOfMovies);
}

function handleRatingSelector(event){
  ratings = event.target.value;
  let filterByRating = getFilteredData();
  parentElement.innerHTML = "";
  createMovieCard(ratings ? filterByRating : movies);
}

function debounce(callback,delay){
  let timerId;
  return (...args) =>{
    clearTimeout(timerId);
    timerId = setTimeout(() => {callback(...args)},delay);
  };
}

const debounceInput = debounce(handleSearch,3000);

searchElement.addEventListener("keyup",debounceInput);

movieRatings.addEventListener("change",handleRatingSelector);

const tempArray = movies.map((movie) => movie.Genre.split(','));

const genres = movies.reduce((acc, cur) => {
  let genresArr = [];
  let tempGenresArr = cur.Genre.split(",");
  acc = [...acc, ...tempGenresArr];
  for (let genre of acc) {
    if (!genresArr.includes(genre)) {
      genresArr = [...genresArr, genre];
    }
  }
  return genresArr;
}, []);

for(let genre of genres){
  const option = createElement("option");
  option.classList.add("option");
  option.setAttribute("value",genre);
  option.innerText = genre;
  movieGenres.appendChild(option);
}

function handleGenreSelector(event){
  genreVal = event.target.value;
  let filterByGenre = getFilteredData();
  parentElement.innerHTML = "";
  createMovieCard(genreVal ? filterByGenre : movies);
}

movieGenres.addEventListener("change",handleGenreSelector);

createMovieCard(movies);