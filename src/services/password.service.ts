import bcrypt from "bcrypt";

export class PasswordService {
  private static rounds = 10;

  static createPassword = async (plain: string): Promise<string> => {
    return bcrypt.hash(plain, PasswordService.rounds);
  };

  static comparePasswords = (hash: string, plain: string): Promise<boolean> => {
    return bcrypt.compare(plain, hash);
  };
}
