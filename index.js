const parentElement = document.querySelector(".main");
const searchElement = document.querySelector(".input");
const movieRatings = document.querySelector(".rating");

let searchValue = "";
let ratings = 0;
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

function debounce(callback,delay){
  let timerId;
  return (...args) =>{
    clearTimeout(timerId);
    timerId = setTimeout(() => {callback(...args)},delay);
  };
}

const debounceInput = debounce(handleSearch,3000);

searchElement.addEventListener("keyup",debounceInput);

// movieRating.s

createMovieCard(movies);