"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- CORE UTILITIES ---
function getAirdropDataFromForm(formData: FormData) {
  return {
    airdropName: formData.get("airdropName") as string,
    chain: formData.get("chain") as string,
    tokenTicker: (formData.get("tokenTicker") as string) || null,
    wallet: (formData.get("wallet") as string) || null,
    websiteLink: (formData.get("websiteLink") as string) || null,
    xHandle: (formData.get("xHandle") as string) || null,
    telegram: (formData.get("telegram") as string) || null,
    contactEmail: (formData.get("contactEmail") as string) || null,
    description: (formData.get("description") as string) || null,
  };
}

// 1) Create
export async function createAirdrop(formData: FormData, userId: string) {
  const data = getAirdropDataFromForm(formData);
  await prisma.airdrop.create({
    data: { ...data, userId, status: "PLANNED" },
  });
  revalidatePath("/dashboard");
}

// 2) Update
export async function updateAirdrop(
  formData: FormData,
  userId: string,
  airdropId: string,
) {
  const data = getAirdropDataFromForm(formData);
  await prisma.airdrop.update({
    where: { id: airdropId, userId },
    data,
  });
  revalidatePath("/dashboard");
}

// 3) Toggle DONE / IN_PROGRESS
export async function toggleDoneStatus(id: string, currentStatus: string) {
  const newStatus = currentStatus === "DONE" ? "IN_PROGRESS" : "DONE";
  await prisma.airdrop.update({
    where: { id },
    data: { status: newStatus as any },
  });
  revalidatePath("/dashboard");
}

// 4. Action to Mark Landed with Dollar Value! 💸
export async function markAsLanded(id: string, dollarValue: number) {
  await prisma.airdrop.update({
    where: { id },
    data: {
      status: "LANDED",
      landedValue: dollarValue,
      landedAt: new Date(),
      ruggedAt: null,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

// 5. Action to Mark as Rugged / Zonked 💀
export async function markAsRugged(id: string) {
  await prisma.airdrop.update({
    where: { id },
    data: {
      status: "RUGGED",
      ruggedAt: new Date(),
      landedAt: null,
      landedValue: null,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

// 6) Bulk delete
export async function deleteAirdrops(ids: string[]) {
  await prisma.airdrop.deleteMany({
    where: { id: { in: ids } },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}
