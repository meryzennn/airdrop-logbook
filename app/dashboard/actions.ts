"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Status } from "@prisma/client";

// ✅ GANTI PATH ini kalau auth kamu beda
import { auth } from "@/auth";

/* ---------------- Auth helper ---------------- */
async function requireUserId(passedUserId?: string) {
  if (passedUserId) return passedUserId;

  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

/* ---------------- Date helper (user input) ----------------
   Input dari NeonDatePicker: "YYYY-MM-DD"
   Kita bikin Date jam 12:00 biar gak geser tanggal karena timezone.
*/
function parseISODateToNoon(value: string | null | undefined) {
  if (!value) return undefined;
  const v = String(value).trim();
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return undefined;

  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);

  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return undefined;

  const dt = new Date(y, mo - 1, d, 12, 0, 0, 0);
  if (Number.isNaN(dt.getTime())) return undefined;

  return dt;
}

function cleanStr(v: FormDataEntryValue | null) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

/* ---------------- CORE UTILITIES ---------------- */
function getAirdropDataFromForm(formData: FormData) {
  const taskDateISO = cleanStr(formData.get("taskDate")); // "YYYY-MM-DD"
  const taskDate = parseISODateToNoon(taskDateISO);

  return {
    airdropName: String(formData.get("airdropName") || "").trim(),
    chain: String(formData.get("chain") || "").trim(),
    tokenTicker: cleanStr(formData.get("tokenTicker")),
    wallet: cleanStr(formData.get("wallet")),
    websiteLink: cleanStr(formData.get("websiteLink")),
    xHandle: cleanStr(formData.get("xHandle")),
    telegram: cleanStr(formData.get("telegram")),
    contactEmail: cleanStr(formData.get("contactEmail")),
    description: cleanStr(formData.get("description")),
    taskDate, // Date | undefined
  };
}

function assertRequiredCreate(data: { airdropName: string; chain: string }) {
  if (!data.airdropName) throw new Error("airdropName is required");
  if (!data.chain) throw new Error("chain is required");
}

/* ---------------- ACTIONS ---------------- */

// 1) Create a new airdrop
export async function createAirdrop(formData: FormData, userId?: string) {
  const uid = await requireUserId(userId);
  const data = getAirdropDataFromForm(formData);
  assertRequiredCreate(data);

  await prisma.airdrop.create({
    data: {
      userId: uid,
      airdropName: data.airdropName,
      chain: data.chain,
      tokenTicker: data.tokenTicker,
      wallet: data.wallet,
      websiteLink: data.websiteLink,
      xHandle: data.xHandle,
      telegram: data.telegram,
      contactEmail: data.contactEmail,
      description: data.description,
      status: Status.PLANNED,
      ...(data.taskDate ? { taskDate: data.taskDate } : {}),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

// 2) Update existing airdrop
export async function updateAirdrop(
  formData: FormData,
  userId: string | undefined,
  airdropId: string,
) {
  const uid = await requireUserId(userId);
  const data = getAirdropDataFromForm(formData);

  if (!data.airdropName) throw new Error("airdropName is required");
  if (!data.chain) throw new Error("chain is required");

  await prisma.airdrop.update({
    where: { id: airdropId, userId: uid },
    data: {
      airdropName: data.airdropName,
      chain: data.chain,
      tokenTicker: data.tokenTicker,
      wallet: data.wallet,
      websiteLink: data.websiteLink,
      xHandle: data.xHandle,
      telegram: data.telegram,
      contactEmail: data.contactEmail,
      description: data.description,
      ...(data.taskDate ? { taskDate: data.taskDate } : {}), // kalau kosong, jangan overwrite
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

// 3) Toggle DONE / IN_PROGRESS
export async function toggleDoneStatus(id: string, currentStatus: string) {
  const uid = await requireUserId();

  // status final gak boleh di-toggle
  if (currentStatus === Status.LANDED || currentStatus === Status.RUGGED) {
    revalidatePath("/dashboard");
    return;
  }

  const next = currentStatus === Status.DONE ? Status.IN_PROGRESS : Status.DONE;

  await prisma.airdrop.update({
    where: { id, userId: uid },
    data: { status: next },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

// 4) Mark as Landed + value (set landedAt)
export async function markAsLanded(id: string, dollarValue: number) {
  const uid = await requireUserId();

  const val = Number(dollarValue);
  if (!Number.isFinite(val) || val <= 0) {
    throw new Error("Landed value must be > 0");
  }

  await prisma.airdrop.update({
    where: { id, userId: uid },
    data: {
      status: Status.LANDED,
      landedValue: val, // Float? => decimal aman
      landedAt: new Date(),
      ruggedAt: null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

// 5) Mark as Rugged (set ruggedAt)
export async function markAsRugged(id: string) {
  const uid = await requireUserId();

  await prisma.airdrop.update({
    where: { id, userId: uid },
    data: {
      status: Status.RUGGED,
      ruggedAt: new Date(),
      landedAt: null,
      landedValue: null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

// 6) Bulk delete (only own rows)
export async function deleteAirdrops(ids: string[]) {
  const uid = await requireUserId();

  if (!Array.isArray(ids) || ids.length === 0) return;

  await prisma.airdrop.deleteMany({
    where: {
      userId: uid,
      id: { in: ids },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}
