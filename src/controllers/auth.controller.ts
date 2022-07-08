import express from "express";
import * as yup from "yup";
import { UserRepository } from "../entities/user-entity/user.repository";
import { PasswordService } from "../services/password.service";
import { AuthService } from "../services/auth.service";
import { ObjectId } from "mongodb";

export const authController = express.Router();

type SignInDto = {
  email: string;
  password: string;
};

authController.post("/api/auth/sign-in", async (req, res) => {
  const dto = req.body as SignInDto;

  try {
    await yup
      .object()
      .shape({
        email: yup.string().email().required(),
        password: yup.string().max(16).min(6).required(),
      })
      .validate(dto);
  } catch (err: any) {
    return res.status(400).send(err.errors);
  }

  const user = await UserRepository.collection.findOne({ email: dto.email });

  if (!user) {
    return res
      .status(400)
      .send({ message: "Email or password is not correct." })
  }

  const passwordIsOk = await PasswordService.comparePasswords(
    user.password,
    dto.password
  );

  if (!passwordIsOk) {
    return res
      .status(400)
      .send({ message: "Email or password is not correct." })
  }

  const accessToken = AuthService.createAccessToken({ userId: user._id });

  return res.status(200).send({ token: accessToken });
});

type SignUpDto = {
  email: string;
  password: string;
};

authController.post("/api/auth/sign-up", async (req, res) => {
  const dto = req.body as SignUpDto;

  try {
    await yup
      .object()
      .shape({
        email: yup.string().email().required(),
        password: yup.string().max(16).min(6).required(),
      })
      .validate(dto);
  } catch (err: any) {
    return res.status(400).send(err.errors);
  }

  const user = await UserRepository.collection.findOne({ email: dto.email });

  if (user) {
    return res.send(["email user already exist"]).status(400);
  }

  const password = await PasswordService.createPassword(dto.password);

  await UserRepository.collection.insertOne(
    { _id: new ObjectId(), email: dto.email, password },
    { forceServerObjectId: true }
  );

  return res.sendStatus(200);
});
