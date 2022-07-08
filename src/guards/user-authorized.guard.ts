import express from "express";
import { AuthService } from "../services/auth.service";
import { ObjectId } from "mongodb";

export type AuthorizedRequest = express.Request & { user: { _id: ObjectId } };

export class UserAuthorizedGuard {
  static check = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.headers.authorization?.length) {
      return res.status(401).send({ message: "No authorization header." });
    }

    const authorizationHeader = "Bearer ";
    const accessToken = req.headers.authorization.slice(
      authorizationHeader.length
    );

    let decoded: { userId: ObjectId };

    try {
      decoded = await AuthService.decodeAndVerifyAccessToken(accessToken);
    } catch (err) {
      return res.status(401).send({ message: "Token is" });
    }

    (req as AuthorizedRequest).user = { _id: decoded.userId };

    next();
  };
}
