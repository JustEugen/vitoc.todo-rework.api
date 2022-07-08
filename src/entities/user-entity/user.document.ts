import { ObjectId } from "mongodb";

export const USER_COLLECTION = "users";

export type UserDocument = {
  _id: ObjectId;

  email: string;

  password: string;
};
