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

const calculateDays = (waterDate, currentDate, plantName, dateObj) => {
  const currentDay = currentDate[2];
  const waterDay = waterDate[2];

  let daysTilWater = 0;

  let waterWarning = `${plantName} needs water in`;

  console.log(dateObj);

  if (dateObj.getTime() < d.getTime()) {
    if (currentDay - waterDay < 0) {
      daysTilWater = currentDay - waterDay;
      waterWarning = `${waterWarning} <strong>${Math.abs(daysTilWater)}</strong> day(s)`;
    } else {
      daysTilWater = currentDay - waterDay;
      waterWarning = `${plantName} needed water <strong>${daysTilWater}</strong> day(s) ago`;
    }
  } else {
    waterWarning = 'You can not water plants in the future';
  }

  return waterWarning;
};

const calculateDate = (waterDate, plantKind, plantName) => {
  const waterDay = waterDate.split('-');
  const currentDate = todaysDate.split('-');

  const wD = new Date(waterDate);
  const daysInMonth = new Date(wD.getFullYear(), wD.getMonth() + 1, 0);

  if (plantKind === 'Low Light') {
    waterDay[2] = parseInt(waterDay[2], 10) + lowLightWater;
  } else if (plantKind === 'Indirect Light') {
    waterDay[2] = parseInt(waterDay[2], 10) + indirectWater;
  } else if (plantKind === 'Low Sunlight') {
    waterDay[2] = parseInt(waterDay[2], 10) + lowSunWater;
  } else {
    waterDay[2] = parseInt(waterDay[2], 10) + succWater;
  }

  if (waterDay[2] > daysInMonth.getDate()) {
    console.log(daysInMonth.getDate());
    console.log(waterDay[2]);
    waterDay[1] += 1;
    waterDay[2] -= daysInMonth.getDate();
    console.log(waterDay[2]);

    if (waterDay[1] > 12) {
      waterDay[1] = 1;
    }
  }

  return calculateDays(waterDay, currentDate, plantName, wD);
};

const htmlTemplate = (plantKind, textInfo) => {
  let plantURL = '/none';

  if (plantKind === 'Low Light') {
    plantURL = '/plant1';
  } else if (plantKind === 'Indirect Light') {
    plantURL = '/plant2';
  } else if (plantKind === 'Low Sunlight') {
    plantURL = '/plant3';
  } else {
    plantURL = '/plant4';
  }

  const htmlTemp = `<div class="carousel-item">
  <img src=${plantURL} alt="plant img">
  <div class="carousel-caption">
      <p>${textInfo}</p>
  </div>
  </div>`;

  return htmlTemp;
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
  users[body.userName].template = [];

  users[body.userName].plantName.push(body.plantName);
  users[body.userName].plantType.push(body.plantType);

  const waterTxt = calculateDate(body.watered, body.plantType, body.plantName);
  users[body.userName].water.push(waterTxt);

  console.log(body.plantType);
  const getTemplate = htmlTemplate(body.plantType, waterTxt);
  users[body.userName].template.push(getTemplate);

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

    const getTemplate = htmlTemplate(body.newPlantType, waterTxt);
    users[body.userName].template.push(getTemplate);


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

    const getTemplate = htmlTemplate(body.newPlantType, waterTxt);
    users[body.userName].template.push(getTemplate);

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
