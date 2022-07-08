import { db } from "../../core/database/connect";
import { TASK_COLLECTION, TaskDocument } from "./task.document";

export class TaskRepository {
  static collection = db.collection<TaskDocument>(TASK_COLLECTION);
}
