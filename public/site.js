// Document Elements
const submitButton = document.querySelector('#submitButton');
const loader = document.querySelector('#loader');
const resultsSection = document.querySelector('#resultsSection');
const resultsWrapper = document.querySelector('#resultsWrapper');

// API Urls
const REQUEST_URL = 'http://localhost:8080/api/fetchResults';

// Get Request handler
submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  const reqUrl = `${REQUEST_URL}`;
  getRequestHandler(reqUrl);
});

// Get request handler
getRequestHandler = async (url) => {
  showLoaderHandler();
  let request = await fetch(url, { method: 'GET' })
    .then((response) => {
      hideLoaderHandler();
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
  showResultsDisplay(request);
};

// Show result and hide loader
showResultsDisplay = (requestedData) => {
  resultsWrapper.style.display = 'block';
  requestedData.results.map((car) => {
    const carData = document.createElement('div');
    carData.classList.add('carData');
    carData.innerHTML = `
    <div class="carData__image">
      <img src="${car.imageSrc}" alt="car image">
    </div>
    <div class="carData__info">
      <h3>${car.title}</h3>
      <h3>${car.model}</h3>
      <p>${car.specs}</p>
      <p>${car.price}</p>
      <a href="${car.link}" target="_blank">View Details</a>
    </div>
    `;
    resultsWrapper.appendChild(carData);
  });
};

// Loader Handlers
showLoaderHandler = () => {
  loader.style.display = 'block';
};

hideLoaderHandler = () => {
  loader.style.display = 'none';
};
