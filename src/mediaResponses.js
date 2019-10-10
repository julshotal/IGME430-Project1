const fs = require('fs');

const lowLight = fs.readFileSync(`${__dirname}/../assets/lowLight.png`);
const indirectLight = fs.readFileSync(`${__dirname}/../assets/indirectLight.png`);
const lowSunlight = fs.readFileSync(`${__dirname}/../assets/lowSunlight.png`);
const succulent = fs.readFileSync(`${__dirname}/../assets/succ.png`);
const none = fs.readFileSync(`${__dirname}/../assets/none.png`);

const loadPLant = (type, request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(type);
  response.end();
};

const getPlant1 = (request, response) => {
  loadPLant(lowLight, request, response);
};

const getPlant2 = (request, response) => {
  loadPLant(indirectLight, request, response);
};

const getPlant3 = (request, response) => {
  loadPLant(lowSunlight, request, response);
};

const getPlant4 = (request, response) => {
  loadPLant(succulent, request, response);
};

const getPlaceholder = (request, response) => {
  loadPLant(none, request, response);
};

module.exports = {
  getPlant1,
  getPlant2,
  getPlant3,
  getPlant4,
  getPlaceholder,
};
