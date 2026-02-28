"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

type Props = {
  fallbackHref?: string;
  label?: string;
};

export default function BackButton({
  fallbackHref = "/",
  label = "Back",
}: Props) {
  const router = useRouter();

  const onBack = () => {
    // If user opened the page directly, go to fallback.
    if (typeof window !== "undefined" && window.history.length <= 1) {
      window.location.href = fallbackHref;
      return;
    }
    router.back();
  };

  return (
    <StyledWrapper>
      <button type="button" className="btn" onClick={onBack} aria-label={label}>
        <span className="arrow">←</span>
        <span className="text">{label}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
    height: 38px;
    padding: 0 12px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    gap: 10px;

    background:
      radial-gradient(
        120px 60px at 15% 20%,
        rgba(16, 185, 129, 0.3),
        rgba(16, 185, 129, 0) 60%
      ),
      linear-gradient(
        to bottom right,
        rgba(16, 185, 129, 0.45) 0%,
        rgba(16, 185, 129, 0) 42%
      );
    background-color: rgba(16, 185, 129, 0.1);

    color: rgba(255, 255, 255, 0.92);
    font-weight: 900;
    font-size: 12px;
    letter-spacing: 0.02em;

    transition: 0.2s ease;
  }

  .btn:hover,
  .btn:focus-visible {
    outline: none;
    transform: translateY(-1px);
    background-color: rgba(16, 185, 129, 0.18);
    border-color: rgba(16, 185, 129, 0.32);
    box-shadow: 0 0 22px rgba(16, 185, 129, 0.22);
  }

  .btn:active {
    transform: translateY(0px) scale(0.99);
  }

  .arrow {
    opacity: 0.9;
    font-weight: 900;
  }

  .text {
    line-height: 1;
  }
`;
