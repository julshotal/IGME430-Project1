// Required to create server/port/and send/recieve requests
const http = require('http');
const url = require('url');
const query = require('querystring');

// Grab reference to methods for the client info, json responses, and images(media)
const html = require('./htmlResponses.js');
const json = require('./responses.js');
const media = require('./mediaResponses.js');

// Create port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Handle POST requests to add new users and new plants
// Create a body which is then passed into to either addUser() or addPlant()
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const res = response;
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      json.addUser(request, res, bodyParams);
    });
  } else if (parsedUrl.pathname === '/addPlant') {
    const res = response;
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      json.addPlant(request, res, bodyParams);
    });
  }
};

// Link URL with corresponding methods for GET and HEAD requests
const urlStruct = {
  GET: {
    '/': html.getIndex,
    '/plant1': media.getPlant1,
    '/plant2': media.getPlant2,
    '/plant3': media.getPlant3,
    '/plant4': media.getPlant4,
    '/none': media.getPlaceholder,
    '/style.css': html.getCSS,
    '/getUser': json.getUser,
    notFound: json.notFound,
  },
  HEAD: {
    '/getUser': json.headUser,
    '/notFound': json.headNotFound,
    notFound: json.notFound,
  },
};

/* Parse the request URL and determine its desired method and path
   and call the desired method if its not a POST request

   Grab the params for getUser() specifically as it takes in
   a search query unlike the other GET requests

   For POST requests, call handlePost() with the desired URL */
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (parsedUrl.pathname === '/getUser') {
    urlStruct[request.method][parsedUrl.pathname](request, response, params);
  } else if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

// Create server
http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);
