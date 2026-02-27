"use client";

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonToggle } from "@/components/ui/NeonToggle";
import { UiverseCheckbox } from "@/components/ui/UiverseCheckbox";
import AddAirdropModal from "./AddAirdropModal";
import { DetailModal } from "./DetailModal";
import { EditModal } from "./EditModal";
import TableAnalytics from "./TableAnalytics";
import {
  toggleDoneStatus,
  markAsLanded,
  markAsRugged,
  deleteAirdrops,
} from "./actions";

import {
  Wallet,
  Send,
  Mail,
  Globe,
  BarChart3,
  Banknote,
  Skull,
  AlertTriangle,
  X as CloseIcon,
  Search,
} from "lucide-react";

/* ---------- helpers ---------- */
const clean = (s?: string) => (s || "").trim();

const cleanX = (s?: string) => clean(s).replace(/^@/, "");
const xUrl = (s?: string) => {
  const v = cleanX(s);
  if (!v) return "";
  if (v.startsWith("http")) return v;
  return `https://x.com/${v}`;
};

const cleanTg = (s?: string) => clean(s).replace(/^@/, "");
const tgUrl = (s?: string) => {
  const v = cleanTg(s);
  if (!v) return "";
  if (v.startsWith("http")) return v;
  return `https://t.me/${v}`;
};

const mailUrl = (s?: string) => {
  const v = clean(s);
  if (!v) return "";
  return `mailto:${v}`;
};

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(n);

const safeTime = (v: any) => {
  const d = new Date(v);
  const t = d.getTime();
  return Number.isFinite(t) ? t : 0;
};

const XLogo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

/* ---------------- UIverse Delete Bin Button ---------------- */
const DeleteBinWrap = styled.div`
  .button {
    width: 50px;
    height: 50px;
    border-radius: 999px;
    background-color: rgb(20, 20, 20);
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    position: relative;
    gap: 1px;
  }

  .svgIcon {
    width: 12px;
    transition-duration: 0.3s;
  }

  .svgIcon path {
    fill: white;
  }

  .button:not(:disabled):hover {
    width: 150px;
    border-radius: 999px;
    transition-duration: 0.3s;
    background-color: rgb(255, 69, 69);
    align-items: center;
    gap: 0;
  }

  .button:not(:disabled):hover .bin-bottom {
    width: 50px;
    transition-duration: 0.3s;
    transform: translateY(60%);
  }
  .bin-top {
    transform-origin: bottom right;
  }
  .button:not(:disabled):hover .bin-top {
    width: 50px;
    transition-duration: 0.3s;
    transform: translateY(60%) rotate(160deg);
  }

  .button::before {
    position: absolute;
    top: -20px;
    content: attr(data-label);
    color: white;
    transition-duration: 0.3s;
    font-size: 2px;
    font-weight: 900;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .button:not(:disabled):hover::before {
    font-size: 12px;
    opacity: 1;
    transform: translateY(35px);
    transition-duration: 0.3s;
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }
`;

function DeleteBinButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <DeleteBinWrap>
      <button
        type="button"
        className="button"
        onClick={onClick}
        disabled={disabled}
        data-label={label}
        aria-label={label}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 69 14"
          className="svgIcon bin-top"
        >
          <g clipPath="url(#clip0_35_24)">
            <path
              fill="black"
              d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
            />
          </g>
          <defs>
            <clipPath id="clip0_35_24">
              <rect fill="white" height={14} width={69} />
            </clipPath>
          </defs>
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 69 57"
          className="svgIcon bin-bottom"
        >
          <g clipPath="url(#clip0_35_22)">
            <path
              fill="black"
              d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
            />
          </g>
          <defs>
            <clipPath id="clip0_35_22">
              <rect fill="white" height={57} width={69} />
            </clipPath>
          </defs>
        </svg>
      </button>
    </DeleteBinWrap>
  );
}

/* ---------------- UIverse Filter Button ---------------- */
const FilterBtnWrap = styled.div`
  .filter {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    background: rgba(24, 24, 27, 0.6);
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.08);
    transition: all 0.25s;
  }

  .filter svg {
    height: 16px;
    fill: rgb(161, 161, 170);
    transition: all 0.25s;
  }

  .filter:hover {
    box-shadow: 0px 12px 18px rgba(0, 0, 0, 0.2);
    background-color: rgb(59, 59, 59);
    border-color: rgba(16, 185, 129, 0.3);
  }

  .filter:hover svg {
    fill: white;
  }
`;

function FilterButton({
  onClick,
  active,
  buttonRef,
}: {
  onClick: () => void;
  active: boolean;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <FilterBtnWrap>
      <button
        ref={buttonRef}
        type="button"
        title="filter"
        onClick={onClick}
        className={`filter ${active ? "ring-2 ring-emerald-500/30" : ""}`}
        aria-label="Filter"
      >
        <svg viewBox="0 0 512 512" height="1em">
          <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
        </svg>
      </button>
    </FilterBtnWrap>
  );
}

/* ---------------- Search (single, not split) ---------------- */
const CosmicSearchWrap = styled.div`
  .search {
    position: relative;
    width: 100%;
    height: 60px;
  }

  .fx {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  .nebula,
  .starfield,
  .stardust,
  .cosmic-ring {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    pointer-events: none;
  }

  .nebula {
    filter: blur(26px);
    opacity: 0.35;
  }
  .nebula::before {
    content: "";
    position: absolute;
    inset: -220px;
    background-image: conic-gradient(
      #000,
      rgba(16, 185, 129, 0.9) 6%,
      #000 35%,
      #000 50%,
      rgba(34, 197, 94, 0.85) 62%,
      #000 88%
    );
    transform: rotate(60deg);
    transition: transform 1.8s;
  }

  .starfield {
    filter: blur(2px);
    opacity: 0.85;
  }
  .starfield::before {
    content: "";
    position: absolute;
    inset: -240px;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      rgba(16, 185, 129, 0.18),
      rgba(0, 0, 0, 0) 12%,
      rgba(0, 0, 0, 0) 50%,
      rgba(34, 197, 94, 0.22),
      rgba(0, 0, 0, 0) 64%
    );
    transform: rotate(82deg);
    transition: transform 1.8s;
  }

  .stardust {
    filter: blur(1.4px);
    opacity: 0.95;
  }
  .stardust::before {
    content: "";
    position: absolute;
    inset: -260px;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      rgba(16, 185, 129, 0.55),
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 50%,
      rgba(34, 197, 94, 0.5),
      rgba(0, 0, 0, 0) 60%
    );
    transform: rotate(83deg);
    transition: transform 1.8s;
  }

  .cosmic-ring {
    filter: blur(0.5px);
    opacity: 1;
  }
  .cosmic-ring::before {
    content: "";
    position: absolute;
    inset: -260px;
    background-image: conic-gradient(
      rgba(5, 7, 27, 1),
      rgba(16, 185, 129, 0.9) 6%,
      rgba(5, 7, 27, 1) 14%,
      rgba(5, 7, 27, 1) 50%,
      rgba(34, 197, 94, 0.9) 62%,
      rgba(5, 7, 27, 1) 66%
    );
    transform: rotate(70deg);
    transition: transform 1.8s;
  }

  .input {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 60px;
    border-radius: 16px;
    background: rgba(9, 9, 11, 0.86);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(236, 253, 245, 0.95);
    padding-left: 52px;
    padding-right: 54px;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    outline: none;
    transition:
      box-shadow 0.25s,
      border-color 0.25s,
      background 0.25s;
  }

  .input::placeholder {
    color: rgba(113, 113, 122, 0.9);
    text-transform: none;
    letter-spacing: 0.02em;
    font-weight: 800;
  }

  .input:focus {
    border-color: rgba(16, 185, 129, 0.35);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.16);
    background: rgba(9, 9, 11, 0.92);
  }

  .left-icon {
    position: absolute;
    z-index: 3;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    opacity: 0.95;
  }

  .right-icon-btn {
    position: absolute;
    z-index: 3;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    height: 40px;
    width: 44px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.2);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .right-icon-btn:hover {
    background: rgba(16, 185, 129, 0.14);
    border-color: rgba(16, 185, 129, 0.32);
  }

  .right-icon-btn:active {
    transform: translateY(-50%) scale(0.96);
  }

  .search:hover .starfield::before {
    transform: rotate(-98deg);
  }
  .search:hover .stardust::before {
    transform: rotate(-97deg);
  }
  .search:hover .cosmic-ring::before {
    transform: rotate(-110deg);
  }
  .search:hover .nebula::before {
    transform: rotate(-120deg);
  }

  .search:focus-within .starfield::before {
    transform: rotate(442deg);
    transition: transform 3.8s;
  }
  .search:focus-within .stardust::before {
    transform: rotate(443deg);
    transition: transform 3.8s;
  }
  .search:focus-within .cosmic-ring::before {
    transform: rotate(430deg);
    transition: transform 3.8s;
  }
  .search:focus-within .nebula::before {
    transform: rotate(420deg);
    transition: transform 3.8s;
  }
`;

function CosmicSearchInput({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}) {
  return (
    <CosmicSearchWrap>
      <div className="search">
        <div className="fx">
          <div className="nebula" />
          <div className="starfield" />
          <div className="stardust" />
          <div className="cosmic-ring" />
        </div>

        <span className="left-icon">
          <Search size={18} className="text-emerald-300" />
        </span>

        <input
          className="input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search intel..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSearch();
            }
          }}
        />

        <button
          type="button"
          className="right-icon-btn"
          onClick={onSearch}
          aria-label="Search"
          title="Search"
        >
          <Search size={18} className="text-emerald-300" />
        </button>
      </div>
    </CosmicSearchWrap>
  );
}

/* ---------------- Hamburger Button ---------------- */
const HamburgerButton = styled.button`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;

  svg {
    height: 2em;
    transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .line {
    fill: none;
    stroke: #e4e4e7;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 3;
    transition:
      stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
      stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1),
      stroke 180ms ease;
  }

  .line-top-bottom {
    stroke-dasharray: 12 63;
  }

  &.open svg {
    transform: rotate(-45deg);
  }

  &.open .line-top-bottom {
    stroke-dasharray: 20 300;
    stroke-dashoffset: -32.42;
  }

  &:hover .line {
    stroke: #10b981;
  }
`;

/* ---------------- Desktop Popover Portal ---------------- */
type PopoverProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
};

function PopoverPortal({
  open,
  anchorEl,
  onClose,
  width = 380,
  children,
}: PopoverProps) {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, w: width });

  const updatePos = useCallback(() => {
    if (!anchorEl) return;

    const rect = anchorEl.getBoundingClientRect();
    const w = Math.min(width, window.innerWidth - 16);
    const gap = 10;

    let left = rect.right - w;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));

    let top = rect.bottom + gap;

    const maxH = 560;
    if (top + maxH > window.innerHeight) {
      top = Math.max(8, rect.top - gap - maxH);
    }

    setPos({ top, left, w });
  }, [anchorEl, width]);

  useEffect(() => setMounted(true), []);

  // ✅ hitung posisi sebelum paint biar gak “loncat”
  useLayoutEffect(() => {
    if (!open) return;
    updatePos();
  }, [open, updatePos]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onResize = () => updatePos();
    const onScroll = () => updatePos();

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, onClose, updatePos]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={onClose}
            className="fixed inset-0 z-[9996] bg-transparent"
          />
          <motion.div
            key="popover"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.14 }}
            style={{ top: pos.top, left: pos.left, width: pos.w }}
            onMouseDown={(e) => e.stopPropagation()}
            className="fixed z-[9997] rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------------- Mobile Filter Sheet ---------------- */
function FilterSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="sheet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9996] bg-zinc-950/70 backdrop-blur-sm"
          />
          <motion.div
            key="sheet"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-0 right-0 bottom-0 z-[9997] rounded-t-[28px] border border-white/10 bg-zinc-950 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur border-b border-white/5 px-5 py-4 flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-widest text-zinc-200">
                Filters
              </p>
              <button
                type="button"
                onClick={onClose}
                className="h-9 w-9 rounded-2xl bg-zinc-900/60 border border-white/10 hover:border-red-500/30 grid place-items-center"
                aria-label="Close"
              >
                <CloseIcon size={16} className="text-zinc-200" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------------- Menu Portal (small height) ---------------- */
function MenuPortal({
  open,
  anchorEl,
  onClose,
  children,
}: {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePos = useCallback(() => {
    if (!anchorEl) return;

    const rect = anchorEl.getBoundingClientRect();
    const menuW = 192;
    const menuH = 140;
    const gap = 10;

    let left = rect.right - menuW;
    left = Math.max(8, Math.min(left, window.innerWidth - menuW - 8));

    let top = rect.bottom + gap;
    if (top + menuH > window.innerHeight) {
      top = rect.top - gap - menuH;
    }
    top = Math.max(8, Math.min(top, window.innerHeight - menuH - 8));

    setPos({ top, left });
  }, [anchorEl]);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open || !anchorEl) return;
    updatePos();
  }, [open, anchorEl, updatePos]);

  useEffect(() => {
    if (!open || !anchorEl) return;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onResize = () => updatePos();
    const onScroll = () => updatePos();

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, anchorEl, onClose, updatePos]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && anchorEl && (
        <>
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={onClose}
            className="fixed inset-0 z-[9998] bg-transparent"
          />
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.14 }}
            style={{ top: pos.top, left: pos.left }}
            onMouseDown={(e) => e.stopPropagation()}
            className="fixed z-[9999] w-48 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------------- Main ---------------- */
const STATUS_OPTIONS = [
  "PLANNED",
  "IN_PROGRESS",
  "DONE",
  "LANDED",
  "RUGGED",
  "ARCHIVED",
] as const;

type Status = (typeof STATUS_OPTIONS)[number];

export default function AirdropClientTable({
  airdrops,
  userId,
}: {
  airdrops: any[];
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  // Search: draft -> click icon / enter -> commit
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const commitSearch = useCallback(() => {
    setSearchQuery((searchDraft || "").trim());
  }, [searchDraft]);

  const fmtTicker = (t?: string) => {
    const v = clean(t);
    if (!v) return "";
    return v.startsWith("$") ? v : `$${v}`;
  };

  // Filter UI
  const [filterOpen, setFilterOpen] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement | null>(null);

  // chain filter stores normalized key (lowercase)
  const [chainKey, setChainKey] = useState<string>("ALL");
  const [statusSet, setStatusSet] = useState<Set<Status>>(new Set()); // empty => all
  const [fromISO, setFromISO] = useState<string>(""); // YYYY-MM-DD
  const [toISO, setToISO] = useState<string>(""); // YYYY-MM-DD

  // mobile/desktop helpers
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const applyMobile = () => setIsMobile(mqMobile.matches);
    applyMobile();
    if (mqMobile.addEventListener)
      mqMobile.addEventListener("change", applyMobile);
    else mqMobile.addListener(applyMobile);

    const mqDesktop = window.matchMedia("(min-width: 768px)");
    const applyDesktop = () => setIsDesktop(mqDesktop.matches);
    applyDesktop();
    if (mqDesktop.addEventListener)
      mqDesktop.addEventListener("change", applyDesktop);
    else mqDesktop.addListener(applyDesktop);

    return () => {
      if (mqMobile.removeEventListener)
        mqMobile.removeEventListener("change", applyMobile);
      else mqMobile.removeListener(applyMobile);

      if (mqDesktop.removeEventListener)
        mqDesktop.removeEventListener("change", applyDesktop);
      else mqDesktop.removeListener(applyDesktop);
    };
  }, []);

  // ✅ lock scroll hanya di MOBILE + kompensasi scrollbar (biar desktop gak geser)
  useEffect(() => {
    if (!filterOpen || !isMobile) return;

    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;

    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarW}px`;

    return () => {
      document.body.style.overflow = prevOverflow || "";
      document.body.style.paddingRight = prevPad || "";
    };
  }, [filterOpen, isMobile]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // menu portal anchor (desktop & mobile)
  type AnchorMap = Record<
    string,
    { desktop?: HTMLDivElement | null; mobile?: HTMLDivElement | null }
  >;
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuAnchorRefs = useRef<AnchorMap>({});

  // overlays
  const [showRuggedOverlay, setShowRuggedOverlay] = useState(false);
  const [showLandedOverlay, setShowLandedOverlay] = useState(false);

  // landed modal input + validation
  const [landingModalOpen, setLandingModalOpen] = useState(false);
  const [selectedAirdropId, setSelectedAirdropId] = useState("");
  const [dollarInput, setDollarInput] = useState("");
  const [landedError, setLandedError] = useState<string | null>(null);

  // view/edit modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAirdropData, setSelectedAirdropData] = useState<any | null>(
    null,
  );

  // active item for menu
  const activeItem = useMemo(() => {
    if (!activeMenuId) return null;
    return airdrops.find((x) => x.id === activeMenuId) ?? null;
  }, [activeMenuId, airdrops]);

  // chain options derived dynamically
  const chainOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of airdrops) {
      const c = clean(a?.chain);
      if (!c) continue;
      const k = c.toLowerCase();
      if (!map.has(k)) map.set(k, c);
    }
    return Array.from(map.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [airdrops]);

  const clearFilters = () => {
    setChainKey("ALL");
    setStatusSet(new Set());
    setFromISO("");
    setToISO("");
  };

  const toggleStatus = (s: Status) => {
    setStatusSet((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const quickStatus = (preset: "ALL" | "ACTIVE" | "FINISHED") => {
    if (preset === "ALL") return setStatusSet(new Set());
    if (preset === "ACTIVE")
      return setStatusSet(new Set(["PLANNED", "IN_PROGRESS", "DONE"]));
    return setStatusSet(new Set(["LANDED", "RUGGED"]));
  };

  // filter + search + sort (newest on top)
  const filteredSorted = useMemo(() => {
    let rows = [...airdrops];

    // search (committed)
    const q = clean(searchQuery).toLowerCase();
    if (q) {
      rows = rows.filter((a) => {
        const blob = [
          a.airdropName,
          a.chain,
          a.tokenTicker,
          a.wallet,
          a.websiteLink,
          a.xHandle,
          a.telegram,
          a.contactEmail,
          a.description,
          a.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return blob.includes(q);
      });
    }

    // chain
    if (chainKey !== "ALL") {
      rows = rows.filter(
        (a) => clean(a?.chain).toLowerCase() === chainKey.toLowerCase(),
      );
    }

    // status
    if (statusSet.size > 0) {
      rows = rows.filter((a) => statusSet.has(a.status as Status));
    }

    // date range on taskDate (inclusive)
    const fromT = fromISO ? safeTime(`${fromISO}T00:00:00`) : null;
    const toT = toISO ? safeTime(`${toISO}T23:59:59`) : null;

    if (fromT || toT) {
      rows = rows.filter((a) => {
        const t = safeTime(a.taskDate ?? a.createdAt);
        if (fromT && t < fromT) return false;
        if (toT && t > toT) return false;
        return true;
      });
    }

    // newest first
    rows.sort((a, b) => {
      const ta = safeTime(a.createdAt ?? a.taskDate);
      const tb = safeTime(b.createdAt ?? b.taskDate);
      return tb - ta;
    });

    return rows;
  }, [airdrops, searchQuery, chainKey, statusSet, fromISO, toISO]);

  // reset page when committed search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, chainKey, statusSet, fromISO, toISO]);

  // pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSorted.length / itemsPerPage),
  );
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSorted.slice(start, start + itemsPerPage);
  }, [filteredSorted, currentPage]);

  const toggleSelectAll = () =>
    selectedIds.length === currentData.length
      ? setSelectedIds([])
      : setSelectedIds(currentData.map((item) => item.id));

  const handleRuggedAction = (id: string) => {
    setShowRuggedOverlay(true);
    setActiveMenuId(null);
    startTransition(() => markAsRugged(id));
    setTimeout(() => setShowRuggedOverlay(false), 5000);
  };

  const landedNum = useMemo(() => {
    const v = parseFloat(dollarInput);
    return Number.isFinite(v) ? v : NaN;
  }, [dollarInput]);

  const landedValid = Number.isFinite(landedNum) && landedNum > 0;

  const handleLandedSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLandedError(null);

    if (!landedValid) {
      setLandedError("Landed value must be > 0");
      return;
    }

    startTransition(() => {
      markAsLanded(selectedAirdropId, landedNum);
      setLandingModalOpen(false);
      setDollarInput("");
      setSelectedAirdropId("");
      setActiveMenuId(null);

      setShowLandedOverlay(true);
      setTimeout(() => setShowLandedOverlay(false), 5000);
    });
  };

  const executeDelete = () => {
    startTransition(() => {
      deleteAirdrops(selectedIds);
      setSelectedIds([]);
      setDeleteModalOpen(false);
    });
  };

  // close menu when page change
  useEffect(() => {
    setActiveMenuId(null);
    setMenuAnchorEl(null);
  }, [currentPage]);

  // filter body (reused in popover/sheet)
  const filterBody = (
    <div className="p-5">
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
          Chain
        </p>
        <select
          value={chainKey}
          onChange={(e) => setChainKey(e.target.value)}
          className="w-full h-11 rounded-2xl bg-zinc-900/60 border border-white/10 text-zinc-100 font-black text-[11px] uppercase tracking-widest px-4 outline-none focus:border-emerald-500/30"
        >
          <option value="ALL">All Chains</option>
          {chainOptions.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 gap-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Status
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => quickStatus("ALL")}
              className="px-3 h-8 rounded-xl bg-zinc-900/60 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:border-white/20"
            >
              All
            </button>
            <button
              type="button"
              onClick={() => quickStatus("ACTIVE")}
              className="px-3 h-8 rounded-xl bg-zinc-900/60 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:border-white/20"
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => quickStatus("FINISHED")}
              className="px-3 h-8 rounded-xl bg-zinc-900/60 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:border-white/20"
            >
              Finish
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => {
            const on = statusSet.has(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleStatus(s)}
                className={[
                  "px-3 h-9 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                  on
                    ? s === "LANDED"
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                      : s === "RUGGED"
                        ? "bg-red-500/15 text-red-300 border-red-500/40"
                        : "bg-white/10 text-zinc-100 border-white/20"
                    : "bg-zinc-900/60 text-zinc-400 border-white/10 hover:border-white/20",
                ].join(" ")}
              >
                {s.replaceAll("_", " ")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
          Task Date Range
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">
              From
            </p>
            <input
              type="date"
              value={fromISO}
              onChange={(e) => setFromISO(e.target.value)}
              className="w-full h-11 rounded-2xl bg-zinc-900/60 border border-white/10 text-zinc-100 font-black text-[11px] uppercase tracking-widest px-4 outline-none focus:border-emerald-500/30"
            />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">
              To
            </p>
            <input
              type="date"
              value={toISO}
              onChange={(e) => setToISO(e.target.value)}
              className="w-full h-11 rounded-2xl bg-zinc-900/60 border border-white/10 text-zinc-100 font-black text-[11px] uppercase tracking-widest px-4 outline-none focus:border-emerald-500/30"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={clearFilters}
          className="flex-1 h-11 rounded-2xl bg-zinc-900/60 border border-white/10 text-zinc-300 font-black text-[10px] uppercase tracking-widest hover:border-white/20 transition-all"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => setFilterOpen(false)}
          className="flex-1 h-11 rounded-2xl bg-emerald-500 text-zinc-950 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95"
        >
          Apply
        </button>
      </div>
    </div>
  );

  if (airdrops.length === 0)
    return (
      <GlassCard className="p-12 text-center border-dashed border-zinc-800 font-[var(--font-body)]">
        <AddAirdropModal userId={userId} />
        <p className="mt-4 text-zinc-500 font-black uppercase tracking-widest leading-none">
          No Intel Found
        </p>
      </GlassCard>
    );

  const showCount = filteredSorted.length;

  return (
    <div className="space-y-6 relative font-[var(--font-body)]">
      {/* Header */}
      <div className="px-2 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <AddAirdropModal userId={userId} />
            <DeleteBinButton
              onClick={() => setDeleteModalOpen(true)}
              disabled={selectedIds.length === 0 || isPending}
              label={`DELETE (${selectedIds.length})`}
            />
          </div>

          <div className="w-full md:max-w-[560px] flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <CosmicSearchInput
                value={searchDraft}
                onChange={setSearchDraft}
                onSearch={commitSearch}
              />
            </div>

            <FilterButton
              active={
                filterOpen ||
                chainKey !== "ALL" ||
                statusSet.size > 0 ||
                !!fromISO ||
                !!toISO
              }
              onClick={() => setFilterOpen((v) => !v)}
              buttonRef={filterBtnRef}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none bg-zinc-800/50 px-4 py-2.5 rounded-lg border border-white/5 shadow-xl">
            LOGS PAGE {currentPage} OF {totalPages}
          </div>

          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
            SHOWING <span className="text-emerald-500">{showCount}</span> /{" "}
            {airdrops.length}
          </div>
        </div>
      </div>

      {/* Filter UI */}
      {isMobile ? (
        <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)}>
          {filterBody}
        </FilterSheet>
      ) : (
        <PopoverPortal
          open={filterOpen}
          anchorEl={filterBtnRef.current}
          onClose={() => setFilterOpen(false)}
          width={420}
        >
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-200">
              Filters
            </p>
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="h-9 w-9 rounded-2xl bg-zinc-900/60 border border-white/10 hover:border-red-500/30 grid place-items-center"
              aria-label="Close"
            >
              <CloseIcon size={16} className="text-zinc-200" />
            </button>
          </div>
          {filterBody}
        </PopoverPortal>
      )}

      {/* Analytics */}
      <TableAnalytics rows={filteredSorted} days={30} />

      {/* Desktop Table */}
      <div className="hidden md:block">
        <GlassCard className="border border-zinc-200 dark:border-zinc-800/80 shadow-lg p-0 !overflow-visible">
          <table className="w-full text-left border-collapse table-fixed min-w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                <th className="p-5 w-[60px] text-center">
                  <UiverseCheckbox
                    checked={
                      selectedIds.length === currentData.length &&
                      currentData.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-5 w-[320px] font-black text-white uppercase tracking-widest">
                  Project & Info
                </th>
                <th className="p-5 w-[160px] font-bold text-center uppercase tracking-widest">
                  Chain
                </th>
                <th className="p-5 w-[100px] font-bold text-center uppercase tracking-widest">
                  Done?
                </th>
                <th className="p-5 w-[120px] font-bold text-center uppercase tracking-widest">
                  Status
                </th>
                <th className="p-5 w-[200px] font-bold text-center uppercase tracking-widest">
                  Actions
                </th>
                <th className="p-5 w-[80px] font-bold text-center uppercase tracking-widest">
                  Menu
                </th>
              </tr>
            </thead>

            {/* ✅ animasi per-page (bukan per-row layout) */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.tbody
                key={`page-${currentPage}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="divide-y divide-zinc-200 dark:divide-zinc-800/50"
              >
                {currentData.map((item) => {
                  const isFinished =
                    item.status === "LANDED" || item.status === "RUGGED";

                  const showLandedValue =
                    item.status === "LANDED" &&
                    typeof item.landedValue === "number" &&
                    item.landedValue > 0;

                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 group"
                    >
                      <td className="p-5 w-[60px] text-center">
                        <UiverseCheckbox
                          checked={selectedIds.includes(item.id)}
                          onChange={() =>
                            setSelectedIds((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((i) => i !== item.id)
                                : [...prev, item.id],
                            )
                          }
                        />
                      </td>

                      <td className="p-5 w-[320px] overflow-hidden">
                        <div className="flex items-center gap-2 mb-2 min-w-0">
                          <p className="font-[var(--font-display)] font-black text-white text-[13px] truncate max-w-[220px] uppercase tracking-tight leading-none">
                            {item.airdropName}
                          </p>

                          {item.tokenTicker && (
                            <span
                              title={fmtTicker(item.tokenTicker)}
                              className="px-2 py-0.5 text-[10px] font-black bg-zinc-700 rounded text-zinc-200 uppercase shrink-0 max-w-[90px] truncate leading-none"
                            >
                              {fmtTicker(item.tokenTicker)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-zinc-400">
                          {item.wallet && (
                            <div
                              title={item.wallet}
                              className="flex items-center gap-1 text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/50 shrink-0 max-w-[120px]"
                            >
                              <Wallet size={12} className="text-emerald-500" />
                              <span className="truncate">
                                {item.wallet.slice(0, 6)}...
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {item.websiteLink && (
                              <a
                                href={item.websiteLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-pink-400 transition-colors"
                                aria-label="Website"
                              >
                                <Globe size={14} />
                              </a>
                            )}

                            {item.xHandle && (
                              <a
                                href={xUrl(item.xHandle)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-zinc-50 transition-colors"
                                aria-label="X"
                              >
                                <XLogo />
                              </a>
                            )}

                            {item.telegram && (
                              <a
                                href={tgUrl(item.telegram)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-sky-400 transition-colors"
                                aria-label="Telegram"
                              >
                                <Send size={14} />
                              </a>
                            )}

                            {item.contactEmail && (
                              <a
                                href={mailUrl(item.contactEmail)}
                                className="hover:text-amber-500 transition-colors"
                                aria-label="Email"
                              >
                                <Mail size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-5 w-[160px] text-center">
                        <span
                          title={item.chain}
                          className="px-3 py-1 bg-zinc-800 rounded-md inline-flex items-center gap-2 text-[10px] font-bold uppercase max-w-[140px] shadow-sm"
                        >
                          <BarChart3 size={12} />
                          <span className="truncate">{item.chain}</span>
                        </span>
                      </td>

                      <td className="p-5 w-[100px] text-center">
                        <div className="flex justify-center">
                          <NeonToggle
                            isOn={
                              item.status !== "PLANNED" &&
                              item.status !== "IN_PROGRESS"
                            }
                            onToggle={() => {
                              if (!isFinished)
                                startTransition(() =>
                                  toggleDoneStatus(item.id, item.status),
                                );
                            }}
                          />
                        </div>
                      </td>

                      <td className="p-5 w-[120px] text-center">
                        <span
                          className={`inline-block w-24 px-2 py-1.5 text-[10px] font-black uppercase rounded-lg border text-center ${
                            item.status === "LANDED"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                              : item.status === "RUGGED"
                                ? "bg-red-500/10 text-red-500 border-red-500/30"
                                : "bg-zinc-100 dark:bg-zinc-800"
                          }`}
                        >
                          {String(item.status || "").replaceAll("_", " ")}
                        </span>

                        {showLandedValue && (
                          <p className="text-[10px] font-black text-emerald-500 mt-1">
                            +$ {formatUSD(item.landedValue)}
                          </p>
                        )}
                      </td>

                      <td className="p-5 w-[200px] text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAirdropData(item);
                              setViewModalOpen(true);
                            }}
                            className="px-3 py-1.5 text-[10px] font-black text-emerald-500 border border-emerald-500/50 rounded-lg hover:bg-emerald-500 hover:text-zinc-950 transition-all uppercase tracking-widest leading-none shadow-sm active:scale-95"
                          >
                            DETAIL
                          </button>

                          {!isFinished && (
                            <button
                              onClick={() => {
                                setSelectedAirdropData(item);
                                setEditModalOpen(true);
                              }}
                              className="px-3 py-1.5 text-[10px] font-black text-blue-500 border border-blue-500/50 rounded-lg hover:bg-blue-500 hover:text-zinc-950 transition-all uppercase tracking-widest leading-none shadow-sm active:scale-95"
                            >
                              EDIT
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-5 w-[80px] text-center">
                        <div
                          ref={(el) => {
                            if (!menuAnchorRefs.current[item.id])
                              menuAnchorRefs.current[item.id] = {};
                            menuAnchorRefs.current[item.id].desktop = el;
                          }}
                          className="inline-flex items-center justify-center"
                        >
                          <HamburgerButton
                            type="button"
                            className={activeMenuId === item.id ? "open" : ""}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (activeMenuId === item.id) {
                                setActiveMenuId(null);
                                setMenuAnchorEl(null);
                              } else {
                                setActiveMenuId(item.id);
                                setMenuAnchorEl(e.currentTarget as HTMLElement);
                              }
                            }}
                            aria-label="Menu"
                          >
                            <svg viewBox="0 0 32 32">
                              <path
                                className="line line-top-bottom"
                                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                              />
                              <path className="line" d="M7 16 27 16" />
                            </svg>
                          </HamburgerButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </GlassCard>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center gap-3 px-2 pb-2 bg-zinc-800/30 py-3 rounded-xl border border-white/5 mx-2 shadow-xl">
          <UiverseCheckbox
            checked={
              selectedIds.length === currentData.length &&
              currentData.length > 0
            }
            onChange={toggleSelectAll}
          />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
            Select All Intel
          </span>
        </div>

        {/* ✅ animasi per-page */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`m-page-${currentPage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {currentData.map((item) => {
              const isFinished =
                item.status === "LANDED" || item.status === "RUGGED";
              const showLandedValue =
                item.status === "LANDED" &&
                typeof item.landedValue === "number" &&
                item.landedValue > 0;

              return (
                <GlassCard
                  key={item.id}
                  className="p-5 flex flex-col gap-4 border border-zinc-800 shadow-md mx-2"
                >
                  <div className="flex items-start justify-between gap-3 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <UiverseCheckbox
                        checked={selectedIds.includes(item.id)}
                        onChange={() =>
                          setSelectedIds((prev) =>
                            prev.includes(item.id)
                              ? prev.filter((i) => i !== item.id)
                              : [...prev, item.id],
                          )
                        }
                      />

                      <div className="flex flex-col min-w-0">
                        <p className="font-[var(--font-display)] font-black text-white text-[13px] truncate uppercase tracking-tight leading-none">
                          {item.airdropName}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-black uppercase truncate mt-1 leading-none">
                          {item.tokenTicker
                            ? fmtTicker(item.tokenTicker)
                            : "NO TICKER"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`px-2 py-1 text-[9px] font-black tracking-wider uppercase rounded border ${
                          item.status === "LANDED"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                            : item.status === "RUGGED"
                              ? "bg-red-500/10 text-red-500 border-red-500/30"
                              : "bg-zinc-800 border-zinc-700"
                        } leading-none`}
                      >
                        {String(item.status || "").replaceAll("_", " ")}
                      </span>

                      {showLandedValue && (
                        <p className="text-[10px] font-black text-emerald-500 mt-1 leading-none">
                          +$ {formatUSD(item.landedValue)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-white/5 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase leading-none min-w-0">
                      <BarChart3 size={12} className="text-emerald-500" />
                      <span className="truncate max-w-[180px]">
                        {item.chain}
                      </span>
                    </div>

                    {item.wallet && (
                      <div
                        title={item.wallet}
                        className="text-[10px] font-mono text-zinc-500 leading-none truncate max-w-[120px]"
                      >
                        {item.wallet.slice(0, 6)}...{item.wallet.slice(-4)}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center gap-2 mt-1">
                    <div className="flex items-center gap-3">
                      <NeonToggle
                        isOn={
                          item.status !== "PLANNED" &&
                          item.status !== "IN_PROGRESS"
                        }
                        onToggle={() => {
                          if (!isFinished)
                            startTransition(() =>
                              toggleDoneStatus(item.id, item.status),
                            );
                        }}
                      />

                      <div className="flex items-center gap-2 text-zinc-500">
                        {item.websiteLink && (
                          <a
                            href={item.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-400 transition-colors"
                            aria-label="Website"
                          >
                            <Globe size={14} />
                          </a>
                        )}
                        {item.xHandle && (
                          <a
                            href={xUrl(item.xHandle)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-zinc-50 transition-colors"
                            aria-label="X"
                          >
                            <XLogo />
                          </a>
                        )}
                        {item.telegram && (
                          <a
                            href={tgUrl(item.telegram)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-sky-400 transition-colors"
                            aria-label="Telegram"
                          >
                            <Send size={14} />
                          </a>
                        )}
                        {item.contactEmail && (
                          <a
                            href={mailUrl(item.contactEmail)}
                            className="hover:text-amber-500 transition-colors"
                            aria-label="Email"
                          >
                            <Mail size={14} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => {
                          setSelectedAirdropData(item);
                          setViewModalOpen(true);
                        }}
                        className="px-3 py-1.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20 rounded-lg uppercase leading-none shadow-sm"
                      >
                        DETAIL
                      </button>

                      {!isFinished && (
                        <button
                          onClick={() => {
                            setSelectedAirdropData(item);
                            setEditModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-[10px] font-bold text-blue-400 border border-blue-500/20 rounded-lg uppercase leading-none shadow-sm"
                        >
                          EDIT
                        </button>
                      )}

                      <div
                        ref={(el) => {
                          if (!menuAnchorRefs.current[item.id])
                            menuAnchorRefs.current[item.id] = {};
                          menuAnchorRefs.current[item.id].mobile = el;
                        }}
                        className="inline-flex"
                      >
                        <HamburgerButton
                          type="button"
                          className={activeMenuId === item.id ? "open" : ""}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeMenuId === item.id) {
                              setActiveMenuId(null);
                              setMenuAnchorEl(null);
                            } else {
                              setActiveMenuId(item.id);
                              setMenuAnchorEl(
                                e.currentTarget as unknown as HTMLElement,
                              );
                            }
                          }}
                          aria-label="Menu"
                        >
                          <svg viewBox="0 0 32 32">
                            <path
                              className="line line-top-bottom"
                              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                            />
                            <path className="line" d="M7 16 27 16" />
                          </svg>
                        </HamburgerButton>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pager */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 pt-10 pb-6 border-t border-white/5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-2.5 text-[10px] font-black text-zinc-500 hover:text-emerald-500 disabled:opacity-20 uppercase tracking-widest bg-zinc-900 border border-white/5 rounded-xl shadow-xl transition-all active:scale-95"
          >
            ← Prev
          </button>

          <span className="text-[11px] font-black text-emerald-500 tracking-widest leading-none">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-2.5 text-[10px] font-black text-zinc-500 hover:text-emerald-500 disabled:opacity-20 uppercase tracking-widest bg-zinc-900 border border-white/5 rounded-xl shadow-xl transition-all active:scale-95"
          >
            Next →
          </button>
        </div>
      )}

      {/* Menu Portal */}
      <MenuPortal
        open={!!activeMenuId && !!menuAnchorEl}
        anchorEl={menuAnchorEl}
        onClose={() => {
          setActiveMenuId(null);
          setMenuAnchorEl(null);
        }}
      >
        {(() => {
          if (!activeItem) return null;

          const isFinished =
            activeItem.status === "LANDED" || activeItem.status === "RUGGED";

          if (isFinished) {
            return (
              <div className="p-4 text-center">
                <p
                  className={`text-[10px] font-black uppercase ${
                    activeItem.status === "LANDED"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {activeItem.status === "LANDED"
                    ? "INTEL SECURED"
                    : "MISSION FAILED"}
                </p>
              </div>
            );
          }

          return (
            <>
              <button
                onClick={() => {
                  setSelectedAirdropId(activeItem.id);
                  setDollarInput("");
                  setLandedError(null);
                  setLandingModalOpen(true);
                  setActiveMenuId(null);
                }}
                className="w-full flex items-center gap-3 px-5 py-4 text-xs font-black text-emerald-500 hover:bg-emerald-500/10 transition-colors uppercase border-b border-zinc-800"
              >
                <Banknote size={16} /> Mark Landed
              </button>

              <button
                onClick={() => handleRuggedAction(activeItem.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-xs font-black text-red-500 hover:bg-red-500/10 transition-colors uppercase"
              >
                <Skull size={16} /> Mark Rugged
              </button>
            </>
          );
        })()}
      </MenuPortal>

      {/* Landing Value Modal */}
      <AnimatePresence>
        {landingModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLandingModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl bg-zinc-900 p-8 shadow-2xl border border-emerald-500/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-[var(--font-display)] text-lg font-black text-white uppercase tracking-tight">
                  Mark as Landed
                </h3>
                <button
                  onClick={() => setLandingModalOpen(false)}
                  className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                >
                  <CloseIcon size={16} />
                </button>
              </div>

              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-4">
                Landed value (USD) — must be &gt; 0
              </p>

              <form onSubmit={handleLandedSubmit} className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-black">
                    $
                  </span>
                  <input
                    value={dollarInput}
                    onChange={(e) => {
                      const normalized = e.target.value.replace(",", ".");
                      let raw = normalized.replace(/[^0-9.]/g, "");

                      const firstDot = raw.indexOf(".");
                      if (firstDot !== -1) {
                        raw =
                          raw.slice(0, firstDot + 1) +
                          raw.slice(firstDot + 1).replace(/\./g, "");
                      }

                      if (raw === "") {
                        setDollarInput("");
                        setLandedError(null);
                        return;
                      }

                      if (raw.startsWith(".")) raw = "0" + raw;

                      const endsWithDot = raw.endsWith(".");
                      const parts = raw.split(".");
                      let intPart = parts[0] ?? "";
                      const fracPart = (parts[1] ?? "").slice(0, 6);

                      intPart = intPart.replace(/^0+(?=\d)/, "");

                      let safe = intPart;

                      if (endsWithDot) {
                        safe = `${intPart || "0"}.`;
                      } else if (raw.includes(".")) {
                        safe = `${intPart || "0"}.${fracPart}`;
                      } else {
                        safe = intPart;
                      }

                      setDollarInput(safe);
                      setLandedError(null);
                    }}
                    type="text"
                    placeholder="e.g. 25"
                    inputMode="decimal"
                    className="w-full h-12 pl-8 pr-4 rounded-2xl bg-zinc-950 border border-white/10 text-zinc-100 font-black tracking-widest outline-none focus:border-emerald-500/40"
                  />
                </div>

                {landedError && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
                    {landedError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setLandingModalOpen(false)}
                    className="flex-1 px-4 py-3 text-xs font-black text-zinc-400 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || !landedValid}
                    className="flex-1 px-4 py-3 text-xs font-black text-zinc-950 bg-emerald-500 rounded-xl hover:bg-emerald-400 shadow-lg uppercase tracking-widest disabled:opacity-40"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-zinc-900 p-8 shadow-2xl border border-red-500/20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 mx-auto border border-red-500/20 shadow-lg">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-[var(--font-display)] text-xl font-black text-white mb-2 uppercase tracking-tight">
                Confirm Deletion
              </h3>
              <p className="text-xs text-zinc-500 mb-8 uppercase tracking-widest font-bold leading-none">
                Deleted intel is gone forever.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-3 text-xs font-bold text-zinc-400 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors uppercase tracking-widest leading-none"
                >
                  CANCEL
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 px-4 py-3 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-lg uppercase tracking-widest leading-none"
                >
                  YES, DELETE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail / Edit Modals */}
      <DetailModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        data={selectedAirdropData}
      />
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        data={selectedAirdropData}
        userId={userId}
      />

      {/* Overlays */}
      <AnimatePresence>
        {showRuggedOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-xl p-6 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="mb-10 text-red-500"
            >
              <Skull size={140} />
            </motion.div>
            <h1 className="font-[var(--font-display)] text-5xl md:text-6xl font-black text-red-500 uppercase tracking-tighter italic shadow-xl mb-4">
              YOU GOT RUGGED!
            </h1>
            <p className="text-base md:text-lg text-red-300 font-bold uppercase tracking-widest max-w-xl leading-none">
              Another mission compromised. tactical dust off.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLandedOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-xl p-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-10 text-emerald-500"
            >
              <Banknote size={140} strokeWidth={1} />
            </motion.div>
            <h1 className="font-[var(--font-display)] text-5xl md:text-6xl font-black text-emerald-500 uppercase tracking-tighter italic shadow-xl mb-4">
              BAG SECURED!
            </h1>
            <p className="text-base md:text-lg text-emerald-300 font-bold uppercase tracking-widest leading-none">
              Mission successful. Intel secured.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
