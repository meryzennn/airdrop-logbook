"use client";

import { UiverseInput } from "@/components/ui/UiverseInput";
import {
  FileText,
  PlusCircle,
  Smartphone,
  Twitter,
  WalletCards,
  Mail,
  Send,
} from "lucide-react";

interface AirdropFormProps {
  defaultValues?: {
    id?: string;
    airdropName?: string;
    chain?: string;
    tokenTicker?: string;
    wallet?: string;
    description?: string;
    xHandle?: string;
    telegram?: string;
    contactEmail?: string;
  };
}

export const AirdropForm = ({ defaultValues }: AirdropFormProps) => {
  return (
    <div className="space-y-8">
      {/* 1. Project Info Section (Gede & Lega) */}
      <section className="bg-zinc-100 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 shadow-inner">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-5">
          <PlusCircle className="w-4 h-4" /> Core Project Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
          <UiverseInput
            id="airdropName"
            label="Project Name"
            defaultValue={defaultValues?.airdropName}
            required
          />
          <UiverseInput
            id="chain"
            label="Network / Chain (e.g., Solana)"
            defaultValue={defaultValues?.chain}
            required
          />
          <UiverseInput
            id="tokenTicker"
            label="Token Ticker (e.g., $RYZEN)"
            defaultValue={defaultValues?.tokenTicker}
          />
          <UiverseInput
            id="wallet"
            label="Wallet Address"
            defaultValue={defaultValues?.wallet}
            startIcon={<WalletCards />}
          />
        </div>
      </section>

      {/* 2. Waitlist & Contacts Section (Space Out properly!) */}
      <section className="bg-white/50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-5">
          <Smartphone className="w-4 h-4" /> Waitlist & Contacts (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UiverseInput
            id="xHandle"
            label="X (Twitter) Handle"
            defaultValue={defaultValues?.xHandle}
            startIcon={<Twitter className="text-blue-400" />}
          />
          <UiverseInput
            id="telegram"
            label="Telegram Username"
            defaultValue={defaultValues?.telegram}
            startIcon={<Send className="text-sky-400" />}
          />
          <UiverseInput
            id="contactEmail"
            label="Registered Email"
            defaultValue={defaultValues?.contactEmail}
            type="email"
            startIcon={<Mail className="text-amber-500" />}
          />
        </div>
      </section>

      {/* 3. Description Section */}
      <section className="p-2 pt-4">
        <UiverseInput
          id="description"
          label="Short Note / Full Description / Tasks"
          defaultValue={defaultValues?.description}
          startIcon={<FileText />}
        />
      </section>
    </div>
  );
};
