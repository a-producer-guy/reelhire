import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Simple password check for demo (in production, use bcrypt)
  // For demo: admin123 for admins, contractor123 for contractors
  const validPassword =
    (user.role === "ADMIN" && password === "admin123") ||
    (user.role === "PRODUCTION_COORDINATOR" && password === "admin123") ||
    (user.role === "CONTRACTOR" && password === "contractor123") ||
    (user.role === "DEPARTMENT_HEAD" && password === "admin123");

  if (!validPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
