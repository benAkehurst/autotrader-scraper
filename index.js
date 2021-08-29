const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

const PAGE_0NE =
  'https://www.autotrader.co.uk/car-search?sort=distance&postcode=n128tj&radius=50&include-delivery-option=on&price-to=8500&year-from=2014&year-to=2021&maximum-mileage=60000&transmission=Automatic&fuel-type=Petrol&body-type=Estate&body-type=Hatchback&seller-type=trade&quantity-of-doors=5&colour=Black&colour=Blue&colour=Brown&colour=Grey&colour=Silver&colour=White&exclude-writeoff-categories=on';
const PAGE_TWO =
  'https://www.autotrader.co.uk/car-search?sort=distance&postcode=n128tj&radius=50&include-delivery-option=on&price-to=8500&year-from=2014&year-to=2021&maximum-mileage=60000&transmission=Automatic&fuel-type=Petrol&body-type=Estate&body-type=Hatchback&seller-type=trade&quantity-of-doors=5&colour=Black&colour=Blue&colour=Brown&colour=Grey&colour=Silver&colour=White&exclude-writeoff-categories=on&page=2';
const PAGE_THREE = `https://www.autotrader.co.uk/car-search?sort=distance&postcode=n128tj&radius=50&include-delivery-option=on&price-to=8500&year-from=2014&year-to=2021&maximum-mileage=60000&transmission=Automatic&fuel-type=Petrol&body-type=Estate&body-type=Hatchback&seller-type=trade&quantity-of-doors=5&colour=Black&colour=Blue&colour=Brown&colour=Grey&colour=Silver&colour=White&exclude-writeoff-categories=on&page=3`;
const PAGE_FOUR = `https://www.autotrader.co.uk/car-search?sort=distance&postcode=n128tj&radius=50&include-delivery-option=on&price-to=8500&year-from=2014&year-to=2021&maximum-mileage=60000&transmission=Automatic&fuel-type=Petrol&body-type=Estate&body-type=Hatchback&seller-type=trade&quantity-of-doors=5&colour=Black&colour=Blue&colour=Brown&colour=Grey&colour=Silver&colour=White&exclude-writeoff-categories=on&page=4`;
const PAGE_FIVE = `https://www.autotrader.co.uk/car-search?sort=distance&postcode=n128tj&radius=50&include-delivery-option=on&price-to=8500&year-from=2014&year-to=2021&maximum-mileage=60000&transmission=Automatic&fuel-type=Petrol&body-type=Estate&body-type=Hatchback&seller-type=trade&quantity-of-doors=5&colour=Black&colour=Blue&colour=Brown&colour=Grey&colour=Silver&colour=White&exclude-writeoff-categories=on&page=5`;

async function init() {
  const cars = [];
  const pages = [PAGE_0NE, PAGE_TWO, PAGE_THREE, PAGE_FOUR, PAGE_FIVE];
  const carModels = ['honda', 'volkswagen', 'ford', 'suzuki', 'hyundai'];

  for (let page of pages) {
    const result = await axios.get(page);
    const $ = cheerio.load(result.data);

    $('.search-page__result').each((i, el) => {
      const car = {};
      car.link = `https://www.autotrader.co.uk/car-details/${el.attribs.id}`;
      car.title = $(el).find('.product-card-details__title').text().trim();
      car.model = $(el).find('.product-card-details__subtitle').text().trim();
      car.price = $(el).find('.product-card-pricing__price').text().trim();
      car.specs = $(el)
        .find('.listing-key-specs')
        .text()
        .trim()
        .replace(/\s+/g, ' ');
      car.distance = $(el)
        .find('.product-card-seller-info__spec-item-copy')
        .text()
        .trim();
      cars.push(car);
    });
  }

  const filteredCars = cars.filter(
    (car) =>
      car.title.toLowerCase().includes('honda') ||
      car.title.toLowerCase().includes('volkswagen') ||
      car.title.toLowerCase().includes('ford') ||
      car.title.toLowerCase().includes('suzuki') ||
      car.title.toLowerCase().includes('hynudai')
  );

  fs.writeFile('cars.json', JSON.stringify(filteredCars, null, 4), (err) => {
    console.log(
      'File successfully written! - Check your project directory for the cars.json file'
    );
  });
}

init();
