const users = {};

const succWater = 15;
const lowSunWater = 10;
const lowLightWater = 8;
const indirectWater = 4;

const d = new Date();
const todaysDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
console.log(todaysDate);

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

const calculateDays = (waterDate, currentDate, plantName) => {
  const currentDay = currentDate[2];
  const waterDay = waterDate[2];

  let daysTilWater = 0;

  let waterWarning = `${plantName} needs water in`;

  if (currentDay - waterDay < 0) {
    daysTilWater = currentDay - waterDay;
    waterWarning = `${waterWarning} <strong>${Math.abs(daysTilWater)}</strong> day(s)`;
  } else if (currentDay - waterDay > 0) {
    daysTilWater = currentDay - waterDay;
    waterWarning = `${plantName} needed water <strong>${daysTilWater}</strong> day(s) ago`;
  }

  return waterWarning;
};

const calculateDate = (waterDate, plantKind, plantName) => {
  const waterDay = waterDate.split('-');
  const currentDate = todaysDate.split('-');

  console.log(waterDate);

  const wD = new Date(waterDate);
  const daysInMonth = new Date(wD.getFullYear, wD.getMonth + 1, 0);

  if (plantKind === 'Low Light') {
    waterDay[2] += lowLightWater;
  } else if (plantKind === 'Indirect Light') {
    waterDay[2] += indirectWater;
  } else if (plantKind === 'Low Sunlight') {
    waterDay[2] += lowSunWater;
  } else {
    waterDay[2] += succWater;
  }

  console.log(wD);

  if (waterDay[2] > daysInMonth.getDate()) {
    console.log(daysInMonth.getDate());
    waterDay[1] += 1;
    waterDay[2] -= daysInMonth.getDate();

    if (waterDay[1] > 12) {
      waterDay[1] = 1;
    }
  }

  return calculateDays(waterDay, currentDate, plantName);
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

  if (!body.userName || !body.plantName || !body.plantType || !body.watered) {
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
  users[body.userName].water = [];

  users[body.userName].plantName.push(body.plantName);
  users[body.userName].plantType.push(body.plantType);
  users[body.userName].water.push(calculateDate(body.watered, body.plantType, body.plantName));

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

  if (!body.newPlantName || !body.newPlantType || !body.newWatered) {
    responseJSON.id = 'missingParameters';
    return respond(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (users[body.userName]) {
    users[body.userName].plantName.push(body.newPlantName);
    users[body.userName].plantType.push(body.newPlantType);

    const waterTxt = calculateDate(body.newWatered, body.newPlantType, body.newPlantName);
    users[body.userName].water.push(waterTxt);

    responseJSON.message = 'Plant added';
  } else {
    users[body.userName] = {};

    users[body.userName].userName = body.userName;
    users[body.userName].plantName = [];
    users[body.userName].plantType = [];
    users[body.userName].water = [];

    users[body.userName].plantName.push(body.newPlantName);
    users[body.userName].plantType.push(body.newPlantType);

    const waterTxt = calculateDate(body.newWatered, body.newPlantType, body.newPlantName);
    users[body.userName].water.push(waterTxt);

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
