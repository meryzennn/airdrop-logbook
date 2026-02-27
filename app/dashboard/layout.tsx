// app/dashboard/layout.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/?callbackUrl=/dashboard");
  }

  return (
    <DashboardLayoutClient
      user={{
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }}
    >
      {children}
    </DashboardLayoutClient>
  );
}
