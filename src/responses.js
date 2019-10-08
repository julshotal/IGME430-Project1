const users = {};

const respond = (request, response, status, user) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(user));
  response.end();
};

const respondEmpty = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

// GET USER
const getUser = (request, response, params) => {
  if (users[String(params.findUser)]) {
    const key = String(params.findUser);
    const user = users[key];

    const responseJSON = {
      user,
    };

    return respond(request, response, 200, responseJSON);
  }
  const responseJSON = {
    message: '404 Error',
    id: 'doesNotExist',
  };

  return respond(request, response, 404, responseJSON);
};

// NOT FOUND

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respond(request, response, 404, responseJSON);
};

// ADD USER
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Please enter the required information',
  };

  if (!body.userName || !body.plantName || !body.plantType) {
    responseJSON.id = 'missingParameters';
    return respond(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (users[body.userName]) {
    responseCode = 204;
  } else {
    users[body.userName] = {};
  }

  users[body.userName].userName = body.userName;
  users[body.userName].plantName = [];
  users[body.userName].plantType = [];

  users[body.userName].plantName.push(body.plantName);
  users[body.userName].plantType.push(body.plantType);

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respond(request, response, responseCode, responseJSON);
  }

  return respondEmpty(request, response, responseCode);
};

const addPlant = (request, response, body) => {
  const responseJSON = {
    message: 'Please enter the required information',
  };

  if (!body.newPlantName || !body.newPlantType) {
    responseJSON.id = 'missingParameters';
    return respond(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (users[body.userName]) {
    users[body.userName].plantName.push(body.newPlantName);
    users[body.userName].plantType.push(body.newPlantType);

    responseJSON.message = 'Plant added';
  } else {
    users[body.userName] = {};
    
    users[body.userName].userName = body.userName;
    users[body.userName].plantName = [];
    users[body.userName].plantType = [];

    users[body.userName].plantName.push(body.newPlantName);
    users[body.userName].plantType.push(body.newPlantType);

    responseCode = 201;
    responseJSON.message = 'User created';
  }

  return respond(request, response, responseCode, responseJSON);
};

module.exports = {
  getUser,
  addUser,
  notFound,
  addPlant,
};
