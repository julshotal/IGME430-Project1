// Require a file stream
const fs = require('fs');

// ReadFileSync each image in the assets folder
const lowLight = fs.readFileSync(`${__dirname}/../assets/lowLight.png`);
const indirectLight = fs.readFileSync(`${__dirname}/../assets/indirectLight.png`);
const lowSunlight = fs.readFileSync(`${__dirname}/../assets/lowSunlight.png`);
const succ = fs.readFileSync(`${__dirname}/../assets/succ.png`);
const none = fs.readFileSync(`${__dirname}/../assets/none.png`);

// Utility function to handle repeated code for writing each image
const loadPLant = (type, request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(type);
  response.end();
};

// Write the lowLight image with a 200 status code
const getPlant1 = (request, response) => {
  loadPLant(lowLight, request, response);
};

// Write the indirectLight image with a 200 status code
const getPlant2 = (request, response) => {
  loadPLant(indirectLight, request, response);
};

// Write the lowSunlight image with a 200 status code
const getPlant3 = (request, response) => {
  loadPLant(lowSunlight, request, response);
};

// Write the succ (succulent) image with a 200 status code
const getPlant4 = (request, response) => {
  loadPLant(succ, request, response);
};

// Write the placeholder/blank image with a 200 status code
const getPlaceholder = (request, response) => {
  loadPLant(none, request, response);
};

// Export methods for use in server.js
module.exports = {
  getPlant1,
  getPlant2,
  getPlant3,
  getPlant4,
  getPlaceholder,
};
