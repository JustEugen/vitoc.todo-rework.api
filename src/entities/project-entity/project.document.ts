import { ObjectId } from "mongodb";

export const PROJECT_COLLECTION = "projects";

export type ProjectDocument = {
  _id: ObjectId;

  user_id: ObjectId;

  name: string;

  slug: string;
};
