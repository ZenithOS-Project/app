import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const HEALTH_CHECK_TOKEN = process.env.HEALTH_CHECK_TOKEN;

  const getBearerToken = (req: Request) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return null;
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;
    return parts[1];
  };

  const token = getBearerToken(request);

  if (token !== HEALTH_CHECK_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  return NextResponse.json({
    status: "up",
    timestamp: new Date(),
  });
}
