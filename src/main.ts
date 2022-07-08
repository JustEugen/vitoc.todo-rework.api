import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { APP_PORT } from "./env-config";
import { connect } from "./core/database/connect";
import { authController } from "./controllers/auth.controller";
import { projectsController } from "./controllers/projects.controller";

const app = express();

function errorHandler(err: any, req: any, res: any, next: any) {
  console.log(err);
  return res.status(500);
}

async function main() {
  try {
    await connect();
  } catch (err) {
    console.log("Cannot connect to database: ", err);
    process.exit(0);
  }

  await new Promise((resolve) => {
    app.listen(APP_PORT, () => {
      console.log(`App is running on port: ${APP_PORT}`);
      resolve("Ok");
    });
  });

  app.use(bodyParser.json());
  app.use(errorHandler);
  app.use(authController);
  app.use(projectsController);
}

main();
