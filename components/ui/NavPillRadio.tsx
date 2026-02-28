"use client";

import React, { useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

type NavId = "product" | "workflow" | "features" | "faq";

type Props = {
  value: NavId;
  onChange: (id: NavId) => void;
  className?: string;
};

const TABS: { id: NavId; label: string }[] = [
  { id: "product", label: "Product" },
  { id: "workflow", label: "Workflow" },
  { id: "features", label: "Features" },
  { id: "faq", label: "FAQ" },
];

export default function NavPillRadio({ value, onChange, className }: Props) {
  const uid = useId();
  const layoutId = `navpill-indicator-${uid}`;
  const btnRefs = useRef<Record<NavId, HTMLButtonElement | null>>({
    product: null,
    workflow: null,
    features: null,
    faq: null,
  });

  useEffect(() => {
    // Keep active tab visible on small screens when the pill container scrolls horizontally.
    const btn = btnRefs.current[value];
    btn?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [value]);

  return (
    <StyledWrapper className={className}>
      <div className="pill" role="tablist" aria-label="Landing navigation">
        {TABS.map((t) => {
          const active = t.id === value;

          return (
            <button
              key={t.id}
              ref={(el) => {
                btnRefs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              className={`tab ${active ? "active" : ""}`}
              onClick={() => onChange(t.id)}
            >
              {/* The indicator lives inside the active tab so width always matches text. */}
              {active && (
                <motion.span
                  layoutId={layoutId}
                  className="indicator"
                  transition={{
                    type: "spring",
                    stiffness: 520,
                    damping: 42,
                    mass: 0.7,
                  }}
                />
              )}

              <span className="label">{t.label}</span>
            </button>
          );
        })}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .pill {
    --pad: 6px;
    --gap: 6px;

    position: relative;
    display: flex;
    align-items: center;
    gap: var(--gap);
    padding: var(--pad);

    width: fit-content;
    max-width: 100%;
    border-radius: 999px;

    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);

    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.22) inset,
      0 16px 60px rgba(0, 0, 0, 0.35);

    /* Mobile friendly: allow sideways scroll if it ever overflows */
    overflow-x: auto;
    scrollbar-width: none;
  }

  .pill::-webkit-scrollbar {
    display: none;
  }

  .tab {
    position: relative;
    border: 0;
    background: transparent;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;

    padding: 8px 12px;
    border-radius: 999px;

    font-weight: 900;
    font-size: 12px;
    letter-spacing: 0.02em;

    color: rgba(255, 255, 255, 0.72);
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  .tab:hover {
    color: rgba(255, 255, 255, 0.92);
    transform: translateY(-1px);
  }

  .tab:active {
    transform: translateY(0px);
  }

  .tab.active {
    color: rgba(255, 255, 255, 0.96);
  }

  .label {
    position: relative;
    z-index: 2;
  }

  .indicator {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    z-index: 1;

    background:
      radial-gradient(
        140px 70px at 20% 20%,
        rgba(16, 185, 129, 0.35),
        transparent 60%
      ),
      linear-gradient(
        90deg,
        rgba(16, 185, 129, 0.22),
        rgba(56, 189, 248, 0.14),
        rgba(217, 70, 239, 0.12)
      );
    border: 1px solid rgba(16, 185, 129, 0.18);

    box-shadow:
      0 0 28px rgba(16, 185, 129, 0.16),
      0 12px 30px rgba(0, 0, 0, 0.25);
  }

  @media (max-width: 640px) {
    .tab {
      padding: 8px 10px;
      font-size: 11px;
    }
  }
`;
