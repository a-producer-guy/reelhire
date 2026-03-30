import { cookies } from "next/headers";
import { prisma } from "./prisma";

// Simple cookie-based auth for demo purposes
// In production, replace with NextAuth.js or similar
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
}

export async function getCurrentUserOrRedirect() {
  const user = await getCurrentUser();
  if (!user) {
    // In a real app, redirect to login
    // For now, return the first admin user as fallback
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });
    return admin;
  }
  return user;
}
