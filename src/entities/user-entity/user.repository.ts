import { db } from "../../core/database/connect";
import { USER_COLLECTION, UserDocument } from "./user.document";

export class UserRepository {
  static collection = db.collection<UserDocument>(USER_COLLECTION);
}
