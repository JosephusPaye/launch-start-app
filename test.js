// @ts-check

const { getApps } = require('@josephuspaye/start-apps');
const { launch } = require('.');

function randomNumber(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function random(array) {
  return array[randomNumber(0, array.length - 1)];
}

async function main() {
  const apps = await getApps();
  const app = random(apps);

  console.log('launching', app);

  const exitCode = await launch(app);

  console.log({ exitCode });
}

main();
