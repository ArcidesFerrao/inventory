import { NextRequest } from "next/server";

export function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token || token !== process.env.API_SECRET_TOKEN) {
    throw new Error("Unauthorized");
  }
}
