// Require a file stream
const fs = require('fs');

// ReadFileSync both the html page and the css stylesheet
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Write the client.html page with a 200 status code
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// Write the css stylesheet with a 200 status code
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// Export for use in server.js
module.exports = {
  getIndex,
  getCSS,
};
