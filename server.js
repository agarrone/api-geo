const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { initCommuneFields, initCommuneFormat, formatCommune } = require('./lib/communeHelpers');
const { initDepartementFields, formatDepartement } = require('./lib/departementHelpers');
const dbCommunes = require('./lib/communes').getIndexedDb();
const dbDepartements = require('./lib/departements').getIndexedDb();
const { pick } = require('lodash');

const app = express();
app.use(cors());
app.use(morgan('dev'));

/* Communes */
app.get('/communes', initCommuneFields, initCommuneFormat, function (req, res) {
  let result;

  const query = pick(req.query, 'codeInsee', 'codePostal', 'nom');
  if (req.query.lat && req.query.lon) {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    if ( Number.isFinite(lat)
      && lat >= -90
      && lat <= 90
      && Number.isFinite(lon)
      && lon >= -180
      && lon <= 180
    ) {
      query.lat = lat;
      query.lon = lon;
    }
  }
  if (query.nom) req.fields.add('_score');

  if (Object.keys(query).length === 0) {
    return res.sendStatus(400);
  }

  result = dbCommunes.search(query);

  if (req.outputFormat === 'geojson') {
    res.send({
      type: 'FeatureCollection',
      features: result.map(commune => formatCommune(req, commune)),
    });
  } else {
    res.send(result.map(commune => formatCommune(req, commune)));
  }
});

app.get('/communes/:codeInsee', initCommuneFields, initCommuneFormat, function (req, res) {
  let commune = dbCommunes.queryByCodeInsee(req.params.codeInsee)[0];
  if (!commune) {
    res.sendStatus(404);
  } else {
    res.send(formatCommune(req, commune));
  }
});

/* Departements */
app.get('/departements', initDepartementFields, function (req, res) {
  let result;

  const query = pick(req.query, 'code', 'nom', 'codeRegion');

  if (Object.keys(query).length === 0) {
    return res.send(dbDepartements.departements);
  }

  if (query.nom) req.fields.add('_score');

  result = dbDepartements.search(query);

  res.send(result.map(commune => formatDepartement(req, commune)));
});

app.get('/departements/:code', initDepartementFields, function (req, res) {
  let departement = dbDepartements.queryByCode(req.params.code)[0];
  if (!departement) {
    res.sendStatus(404);
  } else {
    res.send(formatDepartement(req, departement));
  }
});

/* Definition */
app.get('/definition.yml', function (req, res) {
  res.sendFile(__dirname + '/definition.yml');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  /* eslint no-console: 0 */
  console.log('Start listening on port %d', port);
});

module.exports = app;
