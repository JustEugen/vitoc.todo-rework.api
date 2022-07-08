import { DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "../../env-config";
import { MongoClient } from "mongodb";

const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?maxPoolSize=20&w=majority`;

export const client = new MongoClient(uri);

export const db = client.db("vitoc-task-rework");

export const connect = async () => {
  await client.connect();

  await client.db("admin").command({ ping: 1 });
  console.log("Connected successfully to server");
};
