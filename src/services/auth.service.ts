import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env-config";

export class AuthService {
  static createAccessToken = (data: { userId: ObjectId }): string => {
    return jwt.sign(
      {
        userId: data.userId.toString(),
      },
      JWT_SECRET as string,
      {
        expiresIn: "30h",
      }
    );
  };

  static decodeAndVerifyAccessToken = async (
    token: string
  ): Promise<{ userId: ObjectId }> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET as string, (err, decoded) => {
        if (err) {
          reject(err);
        }

        resolve({
          userId: ObjectId.createFromHexString((decoded as any).userId),
        });
      });
    });
  };
}
