import { ObjectId } from "mongodb";

export const TASK_COLLECTION = "tasks";

export type TaskDocument = {
  _id: ObjectId;

  project_id: ObjectId;

  user_id: ObjectId;

  title: string;

  description: string;

  time: string;

  completed: boolean
};
