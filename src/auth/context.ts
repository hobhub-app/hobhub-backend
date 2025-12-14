import { AuthContext } from "./types";
import { verifyToken } from "./utils";

const context = async ({
  req,
}: {
  req: { headers: { authorization?: string } };
}): Promise<AuthContext> => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const user = token ? verifyToken(token) || undefined : undefined;

  return {
    user,
    isAuthenticated: !!user,
  };
};

export default context;
