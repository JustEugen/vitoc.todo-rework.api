import { db } from "../../core/database/connect";
import { PROJECT_COLLECTION, ProjectDocument } from "./project.document";

export class ProjectRepository {
  static collection = db.collection<ProjectDocument>(PROJECT_COLLECTION);
}
