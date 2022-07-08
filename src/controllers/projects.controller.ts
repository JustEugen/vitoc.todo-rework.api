import express from "express";
import {
  AuthorizedRequest,
  UserAuthorizedGuard,
} from "../guards/user-authorized.guard";
import { ProjectDocument } from "../entities/project-entity/project.document";
import * as yup from "yup";
import { ProjectRepository } from "../entities/project-entity/project.repository";
import slugify from "slugify";
import { ObjectId } from "mongodb";
import { TaskDocument } from "../entities/task-entity/task.document";
import { TaskRepository } from "../entities/task-entity/task.repository";

export const projectsController = express.Router();

projectsController.use(UserAuthorizedGuard.check);

type CreateProjectDto = Pick<ProjectDocument, "name">;
projectsController.post("/api/projects", async (req, res) => {
  const {
    user: { _id },
  } = req as unknown as AuthorizedRequest;

  const dto = req.body as CreateProjectDto;

  try {
    await yup
      .object()
      .shape({
        name: yup.string(),
      })
      .validate(dto);
  } catch (err: any) {
    return res.status(400).send(err.errors);
  }

  const slug = slugify(dto.name, { lower: true });

  const projectBySlug = await ProjectRepository.collection.findOne({ slug });

  if (projectBySlug) {
    return res.status(400).send(["name project with such name already exist."]);
  }

  const { insertedId } = await ProjectRepository.collection.insertOne(
    {
      _id: new ObjectId(),
      user_id: _id,
      slug,
      name: dto.name,
    },
    { forceServerObjectId: true }
  );

  return res.status(200).send({
    _id: insertedId,
    name: dto.name,
    slug,
  });
});

projectsController.get("/api/projects", async (req, res) => {
  const {
    user: { _id },
  } = req as unknown as AuthorizedRequest;

  const projects = await ProjectRepository.collection
    .find({ user_id: _id })
    .toArray();

  return res.status(200).send(projects);
});

projectsController.delete("/api/projects/:projectSlug", async (req, res) => {
  const {
    user: { _id },
  } = req as unknown as AuthorizedRequest;

  const projectSlugToDelete = req.params.projectSlug;

  await ProjectRepository.collection.deleteOne({
    user_id: _id,
    slug: projectSlugToDelete,
  });

  return res.sendStatus(200);
});

type CreateTaskDto = Pick<TaskDocument, "title" | "description" | "time">;
projectsController.post(
  "/api/projects/:projectSlug/tasks",
  async (req, res) => {
    const {
      user: { _id: userId },
    } = req as unknown as AuthorizedRequest;

    const projectSlug = req.params.projectSlug;

    const dto = req.body as CreateTaskDto;

    try {
      await yup
        .object()
        .shape({
          title: yup.string().required(),
          description: yup.string().required(),
          time: yup.string().required(),
        })
        .validate(dto);
    } catch (err: any) {
      return res.status(400).send(err.errors);
    }

    const project = await ProjectRepository.collection.findOne({
      user_id: userId,
      slug: projectSlug,
    });

    if (!project) {
      return res.status(404).send({ message: `You don't have such project.` });
    }

    const { insertedId } = await TaskRepository.collection.insertOne(
      {
        _id: new ObjectId(),
        user_id: userId,
        project_id: project._id,
        description: dto.description,
        title: dto.title,
        time: dto.time,
        completed: false,
      },
      { forceServerObjectId: true }
    );

    return res.status(200).send({
      _id: insertedId,
      user_id: userId,
      project_id: project._id,
      description: dto.description,
      title: dto.title,
      time: dto.time,
      completed: false,
    });
  }
);

projectsController.get("/api/projects/:projectSlug/tasks", async (req, res) => {
  const {
    user: { _id: userId },
  } = req as unknown as AuthorizedRequest;

  const projectSlug = req.params.projectSlug;

  const project = await ProjectRepository.collection.findOne({
    slug: projectSlug,
  });

  if (!project) {
    return res.status(404).send({ message: `You don't have such project.` });
  }

  const tasks = await TaskRepository.collection
    .find({
      user_id: userId,
      project_id: project._id,
    })
    .toArray();

  return res.status(200).send(tasks);
});

projectsController.delete(
  "/api/projects/:projectSlug/tasks/:taskId",
  async (req, res) => {
    const {
      user: { _id: userId },
    } = req as unknown as AuthorizedRequest;
    const { projectSlug, taskId } = req.params;

    const project = await ProjectRepository.collection.findOne({
      slug: projectSlug,
    });

    if (!project) {
      return res.status(404).send({ message: `You don't have such project.` });
    }

    const task = await TaskRepository.collection.findOne({
      _id: ObjectId.createFromHexString(taskId),
      user_id: userId,
      project_id: project._id,
    });

    if (!task) {
      return res.status(400).send({ message: `You don't have such task.` });
    }

    await TaskRepository.collection.deleteOne({
      _id: task._id,
    });

    res.sendStatus(200);
  }
);
