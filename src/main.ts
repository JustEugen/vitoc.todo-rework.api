import express from 'express';
import bodyParser from 'body-parser';
import { APP_PORT } from './env-config';
import { connect } from './core/database/connect';

const app = express();

async function main() {
  try {
    await connect();
  } catch (err) {
    console.log('Cannot connect to database: ', err);
    process.exit(0);
  }

  await new Promise((resolve) => {
    app.listen(APP_PORT, () => {
      console.log(`App is running on port: ${APP_PORT}`);
      resolve('Ok');
    });
  });

  app.use(bodyParser.json());
}

main();
