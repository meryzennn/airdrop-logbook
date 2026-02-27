// app/dashboard/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AirdropClientTable from "./AirdropClientTable";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/?callbackUrl=/dashboard");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) redirect("/?callbackUrl=/dashboard");

  const raw = await prisma.airdrop.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const airdrops = raw.map((a) => ({
    ...a,
    taskDate: a.taskDate?.toISOString?.() ?? a.taskDate,
    createdAt: a.createdAt?.toISOString?.() ?? a.createdAt,
    updatedAt: a.updatedAt?.toISOString?.() ?? a.updatedAt,
    landedAt: a.landedAt ? a.landedAt.toISOString() : null,
    ruggedAt: a.ruggedAt ? a.ruggedAt.toISOString() : null,
  }));

  return <AirdropClientTable airdrops={airdrops} userId={user.id} />;
}
