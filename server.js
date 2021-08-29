const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');

const { autotraderScraper } = require('./utils/scraper');

const app = express();
require('dotenv').config();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', {
    pageTitle: 'Your AutoTrader feed',
  });
});

app.get('/api/fetchResults', async (req, res) => {
  const results = await autotraderScraper();
  res.status(200).json({
    results,
  });
});

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

const port = process.env.PORT || '8080';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () =>
  console.log(`API running on http://localhost:${port}`)
);
