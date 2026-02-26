import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // Pakai singleton Prisma yang udah kita buat

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  // Blok session: { strategy: "jwt" } kita hapus aja biar otomatis pakai Database Session
});
