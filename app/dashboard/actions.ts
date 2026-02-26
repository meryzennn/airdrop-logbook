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
    websiteLink: (formData.get("websiteLink") as string) || null, // <-- BARU
    xHandle: (formData.get("xHandle") as string) || null,
    telegram: (formData.get("telegram") as string) || null,
    contactEmail: (formData.get("contactEmail") as string) || null,
    description: (formData.get("description") as string) || null,
  };
}

// --- AIRDROP MANAGEMENT ACTIONS ---

// 1. Action to Create a new Airdrop entry with full details
export async function createAirdrop(formData: FormData, userId: string) {
  const data = getAirdropDataFromForm(formData);
  await prisma.airdrop.create({
    data: { ...data, userId, status: "PLANNED" },
  });
  revalidatePath("/dashboard");
}

// 2. Action to Update an existing Airdrop entry
export async function updateAirdrop(
  formData: FormData,
  userId: string,
  airdropId: string,
) {
  const data = getAirdropDataFromForm(formData);
  await prisma.airdrop.update({
    where: { id: airdropId, userId }, // Security: ensuring user owns the entry
    data: data,
  });
  revalidatePath("/dashboard");
}

// 3. Action to toggle DONE / IN_PROGRESS
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
    },
  });
  revalidatePath("/dashboard");
}

// 5. Action to Mark as Rugged / Zonked 💀
export async function markAsRugged(id: string) {
  await prisma.airdrop.update({
    where: { id },
    data: { status: "RUGGED" },
  });
  revalidatePath("/dashboard");
}

// 6. Action for Bulk Delete (Hapus banyak sekaligus)
export async function deleteAirdrops(ids: string[]) {
  await prisma.airdrop.deleteMany({
    where: {
      id: { in: ids },
    },
  });
  revalidatePath("/dashboard");
}
