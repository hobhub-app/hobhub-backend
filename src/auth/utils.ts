import bcrypt from "bcryptjs";

export const hashPassword = async (userPassword: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(userPassword, 10);
  return hashedPassword;
};

export const verifyPassword = async (
  userPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(userPassword, hashedPassword);
  return isMatch;
};
